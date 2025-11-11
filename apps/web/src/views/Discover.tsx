import { useEffect, useState } from "react";
import axios from "axios";
const api = import.meta.env.VITE_API_URL;

export default function Discover() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    axios.get(api + "/api/sessions/discover").then(r => setItems(r.data));
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Discover Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(s => (
          <div key={s._id} className="border rounded p-4">
            <div className="font-medium">{s.topic}</div>
            <div className="text-sm text-gray-500">{s.tags?.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
