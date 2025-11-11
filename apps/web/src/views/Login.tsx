import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = import.meta.env.VITE_API_URL;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await axios.post(api + "/api/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-2xl font-semibold">Login</h2>
        <input className="border px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
