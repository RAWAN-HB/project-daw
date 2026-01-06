// src/pages/Workshop.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";



import "./WorkshopDetailedPage.css";

const API_URL = "https://v-nement-scientifique.onrender.com/api";

export default function WorkshopPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [workshops, setWorkshops] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    speaker: "",
    capacity: "",
  });

  // حماية الصفحة
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const allowedRoles = ["event_organizer", "super_admin", "workshop_animator"];
    if (!allowedRoles.includes(role)) {
      alert("Access denied.");
      navigate("/login");
    }
  }, [navigate]);

  // جلب الورش
  const fetchWorkshops = async () => {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/workshops/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkshops(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load workshops.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [eventId]);

  // جلب المشاركين
  const fetchParticipants = async (workshopId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/workshops/${workshopId}/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(response.data || []);
      setSelectedWorkshop(workshopId);
    } catch (err) {
      alert("Failed to load participants.");
    }
  };

  // إنشاء أو تحديث ورشة
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingWorkshop
      ? `${API_URL}/workshops/${editingWorkshop._id}`
      : `${API_URL}/workshops`;

    const method = editingWorkshop ? "put" : "post";

    const payload = editingWorkshop ? formData : { ...formData, eventId };

    try {
      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(editingWorkshop ? "Workshop updated successfully!" : "Workshop created successfully!");
      setShowForm(false);
      setEditingWorkshop(null);
      setFormData({ title: "", description: "", date: "", duration: "", speaker: "", capacity: "" });
      fetchWorkshops(); // إعادة جلب بدون reload
    } catch (err) {
      alert("Operation failed.");
    }
  };

  // تحديث (فتح النموذج مع البيانات)
  const handleEdit = (workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date.split("T")[0], // للـ input date
      duration: workshop.duration,
      speaker: workshop.speaker,
      capacity: workshop.capacity,
    });
    setShowForm(true);
  };

  // حذف
  const handleDelete = async (workshopId) => {
    if (!window.confirm("Delete this workshop?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/workshops/${workshopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkshops();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // تسجيل / إلغاء تسجيل
  const handleRegister = async (workshopId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_URL}/workshops/${workshopId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  const handleUnregister = async (workshopId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/workshops/${workshopId}/register`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Unregistered successfully!");
    } catch (err) {
      alert("Unregistration failed.");
    }
  };

  if (loading) return <div className="loading">Loading workshops...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="workshop-page">
      <div className="container">
        <h1>Workshop Management</h1>
        <p>Event ID: <strong>{eventId}</strong></p>

        <button className="btn-create" onClick={() => { setShowForm(true); setEditingWorkshop(null); }}>
          + Create New Workshop
        </button>

        {/* نموذج الإنشاء/التحديث */}
        {showForm && (
          <div className="form-overlay">
            <form className="workshop-form" onSubmit={handleSubmit}>
              <h2>{editingWorkshop ? "Edit Workshop" : "Create Workshop"}</h2>
              <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              <input type="number" placeholder="Duration (minutes)" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
              <input placeholder="Speaker" value={formData.speaker} onChange={(e) => setFormData({ ...formData, speaker: e.target.value })} required />
              <input type="number" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
              <div className="form-actions">
                <button type="submit">{editingWorkshop ? "Update" : "Create"}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingWorkshop(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة الورش */}
        <div className="workshops-grid">
          {workshops.length === 0 ? (
            <p>No workshops found for this event.</p>
          ) : (
            workshops.map((workshop) => (
              <div key={workshop._id} className="workshop-card">
                <h3>{workshop.title}</h3>
                <p>{workshop.description || "No description"}</p>
                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                <p><strong>Speaker:</strong> {workshop.speaker}</p>
                <p><strong>Capacity:</strong> {workshop.capacity}</p>

                <div className="card-actions">
                  <button onClick={() => handleEdit(workshop)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(workshop._id)}>Delete</button>
                  <button onClick={() => fetchParticipants(workshop._id)}>View Participants</button>
                  <button onClick={() => handleRegister(workshop._id)}>Register</button>
                  <button className="btn-unregister" onClick={() => handleUnregister(workshop._id)}>Unregister</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* عرض المشاركين */}
        {selectedWorkshop && (
          <div className="participants-modal">
            <h2>Workshop Participants</h2>
            {participants.length === 0 ? (
              <p>No participants yet.</p>
            ) : (
              <ul>
                {participants.map((p) => (
                  <li key={p._id || p.email}>
                    {p.firstName} {p.lastName} ({p.email})
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setSelectedWorkshop(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}