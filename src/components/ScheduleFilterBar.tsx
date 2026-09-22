import { Button } from "@/components/ui/button"
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
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
    <div className="w-full space-y-4">
      <Card>
        <CardHeader className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md border p-1.5 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="text-md font-semibold tracking-tight">
                Filter & Rekap
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80">
                Filter jadwal berdasarkan program studi atau ruangan.
              </CardDescription>
            </div>
          </div>

          <CardAction>
            <div className="flex w-full flex-wrap items-center gap-2.5 md:w-auto">
              {/* Filter Prodi */}
              <Select
                value={selectedProdi}
                onValueChange={(val) => onProdiChange(val ?? "")}
              >
                <SelectTrigger className="w-full bg-background/40 text-xs md:w-50">
                  <SelectValue placeholder="Semua Program Studi" />
                </SelectTrigger>
                <SelectContent className="bg-background/50 backdrop-blur-md">
                  {prodiOptions.map((prodi) => (
                    <SelectItem key={prodi} value={prodi} className="text-xs">
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
                <SelectTrigger className="w-full bg-background/40 text-xs md:w-50">
                  <SelectValue placeholder="Semua Ruangan" />
                </SelectTrigger>
                <SelectContent className="bg-background/50 backdrop-blur-md">
                  {roomOptions.map((room) => (
                    <SelectItem key={room} value={room} className="text-xs">
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Filter */}
              {(selectedProdi !== "" || selectedRoom !== "") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilter}
                  className="h-9 gap-1.5 text-xs text-muted-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}

              {/* Export Rekap Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-full cursor-pointer gap-2 bg-background/40 text-xs md:w-auto"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                    </Button>
                  }
                />
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-background/50 backdrop-blur-md"
                >
                  <DropdownMenuItem
                    onClick={() => exportToExcel(filteredSchedules)}
                    className="cursor-pointer gap-2 py-2 text-xs"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => exportToPDF(filteredSchedules)}
                    className="cursor-pointer gap-2 py-2 text-xs"
                  >
                    <FileText className="h-4 w-4 text-rose-400" />
                    <span>PDF (.pdf)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
