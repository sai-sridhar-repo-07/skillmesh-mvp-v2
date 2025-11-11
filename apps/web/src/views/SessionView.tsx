import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Excalidraw, serializeAsJSON, restore } from "@excalidraw/excalidraw";

const api = import.meta.env.VITE_API_URL;

export default function SessionView() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const excalRef = useRef<any>(null);

  useEffect(() => {
    axios.get(`${api}/api/whiteboard/${id}/snapshots`).then(r => {
      const latest = r.data?.[0];
      if (latest?.data) setInitialData(latest.data);
    });
    const t = setInterval(async () => {
      if (!excalRef.current) return;
      const elements = excalRef.current.getSceneElements();
      const appState = excalRef.current.getAppState();
      const files = excalRef.current.getFiles();
      const payload = serializeAsJSON(elements, appState, files, "local");
      await axios.post(`${api}/api/whiteboard/${id}/snapshot`, { data: JSON.parse(payload) });
    }, 30000); // 30s autosave
    return () => clearInterval(t);
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Session {id}</h2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded p-0 lg:col-span-2 h-[70vh]">
          <Excalidraw
            ref={excalRef}
            initialData={initialData || undefined}
          />
        </div>
        <div className="border rounded p-4">Chat (coming soon)</div>
      </div>
    </div>
  );
}
