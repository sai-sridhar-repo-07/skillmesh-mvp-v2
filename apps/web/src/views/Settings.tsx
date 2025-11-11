import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const schema = z.object({
  bio: z.string().max(300).optional(),
  skills: z.string().optional(),
  tags: z.string().optional(),
});

export default function Settings() {
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const userId = localStorage.getItem("userId");
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then((res) => {
        reset({
          bio: res.data.bio,
          skills: res.data.skills.join(", "),
          tags: res.data.tags.join(", "),
        });
        setAvatar(res.data.avatarUrl);
      });
  }, []);

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    const presign = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/files/presign`,
      { fileName: file.name, fileType: file.type },
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
    );

    await axios.put(presign.data.uploadURL, file, {
      headers: { "Content-Type": file.type },
    });
    setAvatar(presign.data.fileURL);
    setUploading(false);
  };

  const onSubmit = async (data: any) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
      {
        bio: data.bio,
        skills: data.skills.split(",").map((s: string) => s.trim()),
        tags: data.tags.split(",").map((t: string) => t.trim()),
        avatarUrl: avatar,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
    );
    alert("Profile updated!");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-[var(--color-surface)] p-6 rounded-xl shadow transition-all"
      >
        <div className="flex flex-col items-center mb-4">
          <img
            src={avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
            disabled={uploading}
          />
        </div>
        <label className="block mb-2 font-medium">Bio</label>
        <textarea {...register("bio")} className="w-full p-2 rounded-md border mb-4" rows={3} />

        <label className="block mb-2 font-medium">Skills (comma-separated)</label>
        <input {...register("skills")} className="w-full p-2 rounded-md border mb-4" />

        <label className="block mb-2 font-medium">Tags</label>
        <input {...register("tags")} className="w-full p-2 rounded-md border mb-4" />

        <button
          type="submit"
          className="w-full py-2 rounded-xl text-white font-semibold"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
