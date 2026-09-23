import { Box, Button, Flex, Text } from "@radix-ui/themes"
import {
  Filter,
  RotateCcw,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { Select } from "@radix-ui/themes"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"
import { DropdownMenu } from "@radix-ui/themes"
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
            <Select.Root
              value={selectedProdi}
              onValueChange={(val) => onProdiChange(val === "ALL" ? "" : (val ?? ""))}
            >
              <Select.Trigger placeholder="Semua Program Studi" />
              <Select.Content>
                <Select.Item value="ALL">Semua Program Studi</Select.Item>
                {prodiOptions.map((prodi) => (
                  <Select.Item key={prodi} value={prodi}>
                    {prodi}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {/* Filter Ruangan */}
            <Select.Root
              value={selectedRoom}
              onValueChange={(val) => onRoomChange(val === "ALL" ? "" : (val ?? ""))}
            >
              <Select.Trigger placeholder="Semua Ruangan" />
              <Select.Content>
                <Select.Item value="ALL">Semua Ruangan</Select.Item>
                {roomOptions.map((room) => (
                  <Select.Item key={room} value={room}>
                    Lab {room}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {/* Reset Filter */}
            {(selectedProdi !== "" || selectedRoom !== "") && (
              <Button
                variant="soft"
                color="gray"
                onClick={onResetFilter}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}

            {/* Export Rekap Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span>Export</span>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item
                  onClick={() => exportToExcel(filteredSchedules)}
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400 mr-2" />
                  <span>Excel (.xlsx)</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => exportToPDF(filteredSchedules)}
                  className="cursor-pointer gap-2 py-2 text-xs"
                >
                  <FileText className="h-4 w-4 text-rose-400 mr-2" />
                  <span>PDF (.pdf)</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </Card>
    </Box>
  )
}
