import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementForm from "../components/AnnouncementForm";
import AnnouncementList from "../components/AnnouncementList";
import axios from "axios";

export default function AdminDashboard() {
  const token = localStorage.getItem('iss_token');
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const onSaved = (announcement) => {
    setEditing(null);
    setRefreshKey(k => k + 1);
  };

  const handleEdit = (ann) => setEditing(ann);

  const handleLogout = () => {
    localStorage.removeItem('iss_token');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <div>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 font-semibold">{editing ? 'Edit Announcement' : 'Create Announcement'}</h3>
          <AnnouncementForm editing={editing} onSaved={onSaved} onCancel={() => setEditing(null)} />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Announcements</h3>
          <AnnouncementList key={refreshKey} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
