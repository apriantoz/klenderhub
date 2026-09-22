import { Link } from "react-router";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
      <h1 className="text-3xl font-bold">Halaman Login</h1>
      <Link to="/" className="text-teal-400 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}