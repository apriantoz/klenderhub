import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { type Schedule, DAYS_OF_WEEK } from "@/lib/schedule";
import { LAB_ROOMS } from "@/lib/room-constants";
import { PRODI } from "@/lib/prodi-constants";
import { SEMESTER } from "@/lib/semester-constants";
import { Button } from "@radix-ui/themes";
import { Dialog } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, Text, Flex, Box, TextField } from "@radix-ui/themes";
import { Pencil, AlertCircle, CheckCircle2 } from "lucide-react";

interface EditScheduleDialogProps {
  schedule: Schedule;
  onSuccess: () => void;
}

export function EditScheduleDialog({
  schedule,
  onSuccess,
}: EditScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Inisialisasi state dengan fallback aman (mendukung snake_case & camelCase)
  const [courseName, setCourseName] = useState(
    schedule.course_name || schedule.courseName || ""
  );
  const [prodi, setProdi] = useState(schedule.prodi || "");
  const [semester, setSemester] = useState(
    String(schedule.semester ?? SEMESTER[0])
  );
  const [day, setDay] = useState(schedule.day || DAYS_OF_WEEK[0]);
  const [startTime, setStartTime] = useState(
    schedule.start_time || schedule.startTime || "08:00"
  );
  const [endTime, setEndTime] = useState(
    schedule.end_time || schedule.endTime || "10:00"
  );
  const [room, setRoom] = useState(
    schedule.room || schedule.labName || LAB_ROOMS[0]
  );

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!courseName || !prodi || !room || !semester) {
      setErrorMsg("Semua field wajib diisi, bosku!");
      return;
    }

    if (startTime >= endTime) {
      setErrorMsg("Jam selesai harus lebih besar dari jam mulai, bosku!");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("schedules")
      .update({
        course_name: courseName,
        prodi,
        semester: Number(semester),
        day,
        start_time: startTime,
        end_time: endTime,
        room,
      })
      .eq("id", schedule.id);

    setLoading(false);

    if (error) {
      setErrorMsg("Gagal mengupdate jadwal: " + error.message);
    } else {
      setSuccessMsg("Jadwal berhasil diperbarui!");

      setTimeout(() => {
        setOpen(false);
        setSuccessMsg(null);
        onSuccess();
      }, 1000);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setErrorMsg(null);
        setSuccessMsg(null);
      }}
    >
      <Dialog.Trigger>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 text-xs rounded-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors outline-none select-none font-normal bg-transparent border-none text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Jadwal Perkuliahan</Dialog.Title>

        <form onSubmit={handleUpdate}>
          <Flex direction="column" gap="4" mt="2">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 p-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Nama Mata Kuliah */}
            <Flex direction="column" gap="2">
              <Label htmlFor="edit_course_name">Nama Mata Kuliah</Label>
              <TextField.Root
                id="edit_course_name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </Flex>

            {/* Program Studi & Semester */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="edit_prodi">
                    Program Studi
                  </Text>
                  <Select.Root
                    value={prodi}
                    onValueChange={(val) => setProdi(val ?? "")}
                  >
                    <Select.Trigger placeholder="Pilih Prodi" className="w-full" />
                    <Select.Content>
                      {PRODI.map((item) => (
                        <Select.Item key={item} value={String(item)}>
                          {item}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>

              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="edit_semester">
                    Semester
                  </Text>
                  <Select.Root
                    value={semester}
                    onValueChange={(val) => setSemester(val ?? String(SEMESTER[0]))}
                  >
                    <Select.Trigger placeholder="Pilih Semester" className="w-full" />
                    <Select.Content>
                      {SEMESTER.map((sem) => (
                        <Select.Item key={sem} value={String(sem)}>
                          Semester {sem}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>
            </Flex>

            {/* Hari & Ruangan */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="edit_day">
                    Hari
                  </Text>
                  <Select.Root
                    value={day}
                    onValueChange={(val) => setDay(val ?? DAYS_OF_WEEK[0])}
                  >
                    <Select.Trigger id="edit_day" className="w-full" />
                    <Select.Content>
                      {DAYS_OF_WEEK.map((d) => (
                        <Select.Item key={d} value={d}>
                          {d}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>

              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="edit_room">
                    Ruangan Lab
                  </Text>
                  <Select.Root
                    value={room}
                    onValueChange={(val) => setRoom(val ?? LAB_ROOMS[0])}
                  >
                    <Select.Trigger id="edit_room" className="w-full" />
                    <Select.Content>
                      {LAB_ROOMS.map((r) => (
                        <Select.Item key={r} value={r}>
                          Lab {r}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>
            </Flex>

            {/* Jam Mulai & Jam Selesai */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Label htmlFor="edit_start_time">Jam Mulai</Label>
                  <Input
                    id="edit_start_time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </Flex>
              </Box>

              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Label htmlFor="edit_end_time">Jam Selesai</Label>
                  <Input
                    id="edit_end_time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </Flex>
              </Box>
            </Flex>

            {/* Tombol Simpan Perubahan */}
            <Flex justify="end" pt="3">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}