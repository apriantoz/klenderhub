import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
      <h1 className="text-3xl font-bold">Beranda KlenderHub</h1>
      <Link to="/schedule" className="px-4 py-2 bg-teal-600 rounded-lg font-medium hover:bg-teal-500 transition">
        Lihat jadwal
      </Link>
    </div>
  );
}