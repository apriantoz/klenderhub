import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button, Dialog, Select, Text, Flex, Box, TextField } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { DAYS_OF_WEEK } from "@/lib/schedule"
import { LAB_ROOMS } from "@/lib/room-constants"
import { PRODI } from "@/lib/prodi-constants"
import { SEMESTER } from "@/lib/semester-constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AddScheduleDialogProps {
  onSuccess: () => void
}

export function AddScheduleDialog({ onSuccess }: AddScheduleDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [courseName, setCourseName] = useState("")
  const [prodi, setProdi] = useState<string>("")
  const [semester, setSemester] = useState<string>("")
  const [day, setDay] = useState(DAYS_OF_WEEK[0])
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("10:00")
  const [room, setRoom] = useState<string>(LAB_ROOMS[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    // 1. Validasi field kosong
    if (!courseName || !prodi || !room || !semester) {
      setErrorMsg("Semua field wajib diisi, bosku!")
      return
    }

    // 2. Validasi tambahan: Jam selesai harus setelah jam mulai
    if (startTime >= endTime) {
      setErrorMsg("Jam selesai harus lebih besar dari jam mulai, bosku!")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("schedules").insert([
      {
        course_name: courseName,
        prodi,
        semester: Number(semester),
        day,
        start_time: startTime,
        end_time: endTime,
        room,
      },
    ])

    setLoading(false)

    if (error) {
      setErrorMsg("Gagal menyimpan: " + error.message)
    } else {
      setSuccessMsg("Jadwal berhasil ditambahkan!")
      setCourseName("")
      setProdi("")
      setSemester("")

      setTimeout(() => {
        setOpen(false)
        setSuccessMsg(null)
        onSuccess()
      }, 1000)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        setErrorMsg(null)
        setSuccessMsg(null)
      }}
    >
      <Dialog.Trigger>
        <Button>
          <Plus className="h-4 w-4" />
          Tambah Jadwal
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Title>Tambah Jadwal Perkuliahan</Dialog.Title>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" mt="2">
            {errorMsg && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Gagal!</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {successMsg && (
              <Alert className="border border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2Icon />
                <AlertTitle>Sukses!</AlertTitle>
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            {/* Nama Mata Kuliah */}
            <Flex direction="column" gap="2">
              <Label htmlFor="course_name">Nama Mata Kuliah</Label>
              <TextField.Root
                id="course_name"
                placeholder="Contoh: Pemrograman Web"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </Flex>

            {/* Prodi & Semester (2 Kolom) */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="prodi">
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
                  <Text as="label" size="2" weight="medium" htmlFor="semester">
                    Semester
                  </Text>
                  <Select.Root
                    value={semester}
                    onValueChange={(val) => setSemester(val ?? "")}
                  >
                    <Select.Trigger placeholder="Pilih Semester" className="w-full" />
                    <Select.Content>
                      {SEMESTER.map((item) => (
                        <Select.Item key={item} value={item.toString()}>
                          {item}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>
            </Flex>

            {/* Hari & Ruangan (2 Kolom) */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="day">
                    Hari
                  </Text>
                  <Select.Root
                    value={day}
                    onValueChange={(val) => setDay(val ?? DAYS_OF_WEEK[0])}
                  >
                    <Select.Trigger
                      id="day"
                      placeholder="Hari"
                      className="w-full"
                    />
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
                  <Text as="label" size="2" weight="medium" htmlFor="room">
                    Ruangan
                  </Text>
                  <Select.Root
                    value={room}
                    onValueChange={(val) => setRoom(val ?? LAB_ROOMS[0])}
                  >
                    <Select.Trigger
                      id="room"
                      placeholder="Ruang"
                      className="w-full"
                    />
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

            {/* Jam Mulai & Jam Selesai (2 Kolom) */}
            <Flex gap="3" width="100%">
              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Label htmlFor="start_time">Jam Mulai</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Flex>
              </Box>

              <Box style={{ flex: 1 }}>
                <Flex direction="column" gap="2">
                  <Label htmlFor="end_time">Jam Selesai</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Flex>
              </Box>
            </Flex>

            {/* Tombol Simpan */}
            <Flex justify="end" pt="2">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Jadwal"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}