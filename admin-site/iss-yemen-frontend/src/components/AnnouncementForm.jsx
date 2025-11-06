import { useState, useEffect } from "react";
import axios from "axios";

export default function AnnouncementForm({ onSaved, editing = null, onCancel }) {
  const [title, setTitle] = useState(editing?.title || "");
  const [body, setBody] = useState(editing?.body || "");
  const [publishDate, setPublishDate] = useState(
    editing ? new Date(editing.publishDate).toISOString().slice(0,16) : new Date().toISOString().slice(0,16)
  );
  const [preview, setPreview] = useState(false);
  const token = localStorage.getItem('iss_token');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setBody(editing.body || "");
      setPublishDate(editing.publishDate ? new Date(editing.publishDate).toISOString().slice(0,16) : new Date().toISOString().slice(0,16));
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, body, publishDate: new Date(publishDate).toISOString() };
      const headers = { Authorization: `Bearer ${token}` };
      if (editing && editing._id) {
        const res = await axios.put(`http://localhost:5000/announcements/${editing._id}`, payload, { headers });
        onSaved(res.data);
      } else {
        const res = await axios.post('http://localhost:5000/announcements', payload, { headers });
        onSaved(res.data);
      }
      setTitle(''); setBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="p-4 border rounded">
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full mb-2 p-2 border" />
        <textarea placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} className="w-full mb-2 p-2 border" rows={6} />
        <label className="block mb-2">Publish date</label>
        <input type="datetime-local" value={publishDate} onChange={e=>setPublishDate(e.target.value)} className="mb-2 p-2 border" />
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded" type="submit">Save</button>
          <button type="button" onClick={()=>setPreview(!preview)} className="px-3 py-1 bg-gray-200 rounded">Preview</button>
          {onCancel && <button type="button" onClick={onCancel} className="px-3 py-1 bg-red-200 rounded">Cancel</button>}
        </div>
      </form>

      {preview && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-500">{new Date(publishDate).toLocaleString()}</p>
          <div className="mt-2">{body}</div>
        </div>
      )}
    </div>
  );
}
