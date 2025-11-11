import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const api = import.meta.env.VITE_API_URL;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const { data } = await axios.post(api + "/api/auth/register", { name, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-2xl font-semibold">Create account</h2>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <input className="border px-3 py-2 w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
