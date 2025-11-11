import { useEffect, useState } from "react";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    axios.get(api + "/api/analytics/me", { headers: { Authorization: "Bearer " + token } }).then(r => setData(r.data));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Credits</div>
          <div className="text-3xl font-bold">{data?.balanceCredits ?? "—"}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Sessions Hosted</div>
          <div className="text-3xl font-bold">{data?.sessionsHosted ?? "—"}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Earnings (credits)</div>
          <div className="text-3xl font-bold">{data?.earnedCredits ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
