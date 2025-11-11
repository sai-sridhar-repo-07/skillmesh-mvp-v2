import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-bold text-xl">SkillMesh</Link>
          <nav className="flex gap-4">
            <Link to="/discover">Discover</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
          <div className="ml-auto flex gap-3">
            <Link to="/auth/login" className="text-sm underline">Login</Link>
            <Link to="/auth/register" className="text-sm underline">Register</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">© 2025 SkillMesh</div>
      </footer>
    </div>
  );
}
