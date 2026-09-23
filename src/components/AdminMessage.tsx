import { useState, useRef } from "react";
import { Button } from "@radix-ui/themes";
import { Dialog, Flex, Text, TextField, TextArea } from "@radix-ui/themes";
import { MessageSquarePlus, Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast"; 
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

export function AdminMessageDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [senderWA, setSenderWA] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Validasi apakah Turnstile sudah diverifikasi
    if (!turnstileToken) {
      setErrorMessage("Selesaikan verifikasi keamanan (Turnstile) terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // ⚠️ Endpoint diubah dari /api/send-telegram ke /api/report
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: senderName.trim() || "Mahasiswa / Dosen",
          room: roomName.trim() || "Gedung Desain Hub",
          wa: senderWA.trim() || "-",
          message: messageText,
          token: turnstileToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.add({
          description: "Laporan kendala berhasil dikirim ke Telegram Admin.",
        });

        setMessageText("");
        setSenderName("");
        setRoomName("");
        setSenderWA("");
        setTurnstileToken(null);
        setErrorMessage("");
        setIsOpen(false);
      } else {
        setErrorMessage(data.error || "Gagal mengirim laporan ke server.");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Terjadi kesalahan koneksi ke server.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setErrorMessage("");
          setTurnstileToken(null);
        }
      }}
    >
      <Dialog.Trigger>
        <Button variant="outline">
          <MessageSquarePlus className="w-4 h-4" />
          Lapor / Hubungi Admin
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Kirim Pesan ke Admin Lab</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Laporkan kendala fasilitas lab atau tanyakan jadwal khusus langsung
          kepada pengelola Gedung Desain Hub.
        </Dialog.Description>

        <form onSubmit={handleSendMessage}>
          <Flex direction="column" gap="3">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Gagal</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Nama / Identitas */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Nama / Identitas (Opsional)
              </Text>
              <TextField.Root
                placeholder="Contoh: Budi (Mahasiswa Animasi)"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            {/* No. WhatsApp */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                No. WhatsApp untuk konfirmasi <span className="text-rose-500">*</span>
              </Text>
              <TextField.Root
                placeholder="8123456789"
                type="tel"
                value={senderWA}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setSenderWA(numericValue);
                }}
                disabled={isSubmitting}
                required
              >
                <TextField.Slot side="left">+62</TextField.Slot>
              </TextField.Root>
            </label>

            {/* Lokasi Lab / Ruangan */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Lokasi Lab / Ruangan (Opsional)
              </Text>
              <TextField.Root
                placeholder="Contoh: Ruang 1A"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            {/* Pesan / Kendala */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Pesan / Kendala <span className="text-rose-500">*</span>
              </Text>
              <TextArea
                placeholder="Tuliskan kendala fasilitas (misal: TV mati, AC kurang dingin)..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[100px] resize-none text-sm w-full"
              />
            </label>

            {/* Widget Cloudflare Turnstile */}
            <Flex justify="center" pt="1">
              <Turnstile
                ref={turnstileRef}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setErrorMessage("");
                }}
                onExpire={() => setTurnstileToken(null)}
                onError={() =>
                  setErrorMessage("Verifikasi keamanan gagal dimuat.")
                }
                options={{ theme: "dark" }}
              />
            </Flex>
          </Flex>

          {/* Tombol Aksi Bawah */}
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                Batal
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              disabled={isSubmitting || !messageText.trim() || !turnstileToken}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}