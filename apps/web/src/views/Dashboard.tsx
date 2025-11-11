import { useEffect, useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    axios.get(api + "/api/users/me", {
      headers: { Authorization: "Bearer " + token }
    }).then(r => setMe(r.data)).catch(() => setMe(null));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {!me && (
        <div className="text-gray-600">Please login to see your dashboard.</div>
      )}

      {me && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Name</div>
            <div className="text-2xl font-bold">{me.name || "—"}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Email</div>
            <div className="text-2xl font-bold break-all">{me.email}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-500">Credits</div>
            <div className="text-2xl font-bold">{me.credits ?? 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}
