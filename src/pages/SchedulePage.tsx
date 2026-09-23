import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { getConflictingScheduleIds } from "@/lib/schedule";
import type { Schedule } from "@/lib/schedule";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton} from "@radix-ui/themes";
import { useNavigate } from "react-router";
import { ScheduleHeader } from "@/components/ScheduleHeader";
import { ScheduleFilterBar } from "@/components/ScheduleFilterBar";
import { ScheduleTimeline } from "@/components/ScheduleTimeline";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setNow] = useState(() => new Date());

  // State Filter
  const [selectedProdi, setSelectedProdi] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // State Delete Dialog Konfirmasi shadcn/ui
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    courseName: string;
  } | null>(null);

  const navigate = useNavigate();

  // Timer refresh tiap 1 menit untuk update status "Sedang Berlangsung"
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const reloadSchedules = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("start_time", { ascending: true });

    if (!error) setSchedules(data || []);
  };

  useEffect(() => {
    let ignore = false;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!ignore) setIsAdmin(!!session);

      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("start_time", { ascending: true });

      if (!ignore) {
        if (!error) setSchedules(data || []);
        setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    const channel = supabase
      .channel("public-schedules")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedules" },
        () => {
          reloadSchedules();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  // Data Jadwal Terfilter
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const matchProdi = !selectedProdi || item.prodi === selectedProdi;
      const matchRoom = !selectedRoom || item.room === selectedRoom;
      return matchProdi && matchRoom;
    });
  }, [schedules, selectedProdi, selectedRoom]);

  const conflictingIds = useMemo(() => {
    return getConflictingScheduleIds(schedules);
  }, [schedules]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate('/');
    navigate(0); // Memuat ulang halaman di Vite untuk membersihkan state sesi
  };

  const handleDeleteClick = (id: string, courseName?: string) => {
    const targetItem = schedules.find((s) => s.id === id);
    const resolvedName =
      courseName || targetItem?.course_name || targetItem?.courseName || "Jadwal";
    setDeleteTarget({ id, courseName: resolvedName });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error) {
      reloadSchedules();
    }
    setDeleteTarget(null);
  };

  const handleResetFilter = () => {
    setSelectedProdi("");
    setSelectedRoom("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden px-4 py-6 md:px-6">
  <ScheduleHeader
    isAdmin={isAdmin}
    onReloadSchedules={reloadSchedules}
    onLogout={handleLogout}
  />

<div className="my-4 w-full space-y-4">
    {/* Bungkus langsung komponennya dengan Skeleton Radix */}
    <Skeleton loading={loading}>
      <ScheduleFilterBar
        selectedProdi={selectedProdi}
        selectedRoom={selectedRoom}
        onProdiChange={setSelectedProdi}
        onRoomChange={setSelectedRoom}
        onResetFilter={handleResetFilter}
        filteredSchedules={filteredSchedules}
      />
    </Skeleton>

    <Skeleton loading={loading}>
      <ScheduleTimeline
        filteredSchedules={filteredSchedules}
        conflictingIds={conflictingIds}
        isAdmin={isAdmin}
        onReloadSchedules={reloadSchedules}
        onDeleteClick={handleDeleteClick}
      />
    </Skeleton>
  </div>

  {/* Dialog Konfirmasi Hapus */}
  <AlertDialog
    open={!!deleteTarget}
    onOpenChange={(open) => !open && setDeleteTarget(null)}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Yakin ingin menghapus jadwal?</AlertDialogTitle>
        <AlertDialogDescription>
          Tindakan ini akan menghapus jadwal perkuliahan{" "}
          <span className="font-semibold text-foreground">
            &ldquo;{deleteTarget?.courseName}&rdquo;
          </span>{" "}
          secara permanen dari sistem.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={confirmDelete}
          className="bg-rose-600 text-white hover:bg-rose-700"
        >
          Ya, Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>
  )
}