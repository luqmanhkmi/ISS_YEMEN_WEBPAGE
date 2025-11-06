import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Latest Announcements</h1>
      {announcements.length === 0 && <p>No announcements yet.</p>}
      <div className="space-y-4">
        {announcements.map(a => (
          <article key={a._id} className="p-4 border rounded">
            <h2 className="font-semibold">{a.title}</h2>
            <p className="text-sm text-gray-500">{new Date(a.publishDate).toLocaleString()}</p>
            <div className="mt-2">{a.body}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
