import { useState } from "react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Box, Card } from "@radix-ui/themes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from "react-router"; // <-- Gunakan useNavigate dari react-router
import { supabase } from "@/lib/supabase"; // <-- Pastikan supabase sudah diimpor sesuai konfigurasi Anda

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // <-- Inisialisasi navigate

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setLoading(false);
        setErrorMessage(error.message);
        return;
      }

      // Jika sukses, arahkan ke halaman utama
      setLoading(false);
      navigate('/schedule');
      
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full px-4">
  <Box className="w-full max-w-md">
    <Card>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">Login Admin</CardTitle>
        <CardDescription>Masuk untuk mengelola jadwal kelas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Flex justify="end" pt="2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </Flex>
        </form>
      </CardContent>
    </Card>
  </Box>
</div>
  );
}