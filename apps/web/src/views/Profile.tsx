import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
        <p className="text-[var(--color-text-secondary)] mb-4">{user.bio}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {user.skills.map((s: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-[var(--color-surface)] border rounded-full text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
