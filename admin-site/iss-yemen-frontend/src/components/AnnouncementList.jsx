import axios from "axios";
import { useEffect, useState } from "react";

export default function AnnouncementList({ onEdit }) {
  const [items, setItems] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/announcements');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    const token = localStorage.getItem('iss_token');
    try {
      await axios.delete(`http://localhost:5000/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p>No announcements yet.</p>}
      {items.map(a => (
        <div key={a._id} className="p-3 border rounded">
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold">{a.title}</h4>
              <p className="text-sm text-gray-500">{new Date(a.publishDate).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(a)} className="px-2 py-1 bg-yellow-300 rounded">Edit</button>
              <button onClick={() => handleDelete(a._id)} className="px-2 py-1 bg-red-400 text-white rounded">Delete</button>
            </div>
          </div>
          <p className="mt-2">{a.body}</p>
        </div>
      ))}
    </div>
  );
}
