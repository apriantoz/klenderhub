import { Box, Button, Flex, Text } from "@radix-ui/themes"
import {
  Filter,
  RotateCcw,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@radix-ui/themes"
import { LAB_ROOMS } from "@/lib/room-constants"
import { PRODI } from "@/lib/prodi-constants"
import type { Schedule } from "@/lib/schedule"

interface ScheduleFilterBarProps {
  selectedProdi: string
  selectedRoom: string
  onProdiChange: (value: string) => void
  onRoomChange: (value: string) => void
  onResetFilter: () => void
  filteredSchedules: Schedule[]
}

export function ScheduleFilterBar({
  selectedProdi,
  selectedRoom,
  onProdiChange,
  onRoomChange,
  onResetFilter,
  filteredSchedules,
}: ScheduleFilterBarProps) {
  const prodiOptions = PRODI
  const roomOptions = LAB_ROOMS

  return (
    <Box>
  <Card>
    <Flex align="center" justify="between" gap="4" wrap="wrap">
      {/* Sisi Kiri: Judul & Deskripsi */}
      <Flex align="center" gap="3">
        <Filter className="h-4 w-4 shrink-0 text-gray-500" />
        <Box>
          <Text as="div" weight="bold">
            Filter & Rekap
          </Text>
          <Text as="div" size="2" color="gray">
            Filter jadwal berdasarkan program studi atau ruangan.
          </Text>
        </Box>
      </Flex>

      {/* Sisi Kanan: Kumpulan Filter & Tombol Aksi */}
      <Flex align="center" gap="3" wrap="wrap">
        {/* Filter Prodi */}
        <Select
          value={selectedProdi}
          onValueChange={(val) => onProdiChange(val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Program Studi" />
          </SelectTrigger>
          <SelectContent>
            {prodiOptions.map((prodi) => (
              <SelectItem key={prodi} value={prodi}>
                {prodi}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Ruangan */}
        <Select
          value={selectedRoom}
          onValueChange={(val) => onRoomChange(val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Ruangan" />
          </SelectTrigger>
          <SelectContent>
            {roomOptions.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filter */}
        {(selectedProdi !== "" || selectedRoom !== "") && (
          <Button
            variant="ghost"
            onClick={onResetFilter}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}

        {/* Export Rekap Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <Download className="h-3.5 w-3.5 mr-1" />
                <span>Export</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => exportToExcel(filteredSchedules)}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400 mr-2" />
              <span>Excel (.xlsx)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportToPDF(filteredSchedules)}
              className="cursor-pointer gap-2 py-2 text-xs"
            >
              <FileText className="h-4 w-4 text-rose-400 mr-2" />
              <span>PDF (.pdf)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
    </Flex>
  </Card>
</Box>
  )
}
