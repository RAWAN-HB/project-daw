// src/pages/EventsList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./event.css"; // الـ CSS المحدث موجود أدناه أو في الملف

const API_URL = "https://v-nement-scientifique.onrender.com/api";

export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // حماية الصفحة: فقط المنظمين أو الأدمن
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const allowedRoles = ["event_organizer", "super_admin"];
    if (!role || !allowedRoles.includes(role)) {
      alert("Access denied. Please log in with the correct role.");
      navigate("/login");
    }
  }, [navigate]);

  // جلب الأحداث
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing.");
        setLoading(false);
        return;
      }

      try {
        // ⚠️ غيّر هذا المسار إذا كان endpoint مختلف (مثل /events/my أو /events/organized)
        const response = await axios.get(`${API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let eventsArray = [];

        if (Array.isArray(response.data)) {
          eventsArray = response.data;
        } else if (response.data.events) {
          eventsArray = response.data.events;
        } else if (response.data.data) {
          eventsArray = response.data.data;
        }

        setEvents(eventsArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to load events. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // تم إزالة navigate من الـ dependencies لأنه لا يتغير

  // دالة لتنسيق التاريخ (تدعم تاريخ واحد أو نطاق start/end)
  const formatDate = (event) => {
    const start = event.startDate || event.date;
    if (!start) return "Not specified";

    const startDate = new Date(start).toLocaleDateString("en-GB"); // يمكن تغيير الـ locale حسب الحاجة

    if (event.endDate) {
      const endDate = new Date(event.endDate).toLocaleDateString("en-GB");
      return `${startDate} → ${endDate}`;
    }
    return startDate;
  };

  // دالة لتقصير الوصف
  const truncateDescription = (desc) => {
    if (!desc) return "No description";
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-list-page">
      <div className="container">
        <h1>My Events</h1>
        <p>Select an event to manage its workshops</p>

        {/* زر إنشاء حدث جديد */}
        <div className="header-actions">
          <button
            className="btn-create"
            onClick={() => navigate("/create-event")} // ⚠️ غيّر المسار إذا كان route الإنشاء مختلفًا
          >
            + Create New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found.</p>
            <p>Create your first event to get started!</p>
            <button
              className="btn-create"
              onClick={() => navigate("/create-event")}
            >
              + Create Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.title || "Untitled Event"}</h3>
                <p><strong>Date:</strong> {formatDate(event)}</p>
                <p><strong>Location:</strong> {event.location || "Not specified"}</p>
                <p><strong>Description:</strong> {truncateDescription(event.description)}</p>

                <div className="card-actions">
                  <button
                    className="btn-workshops"
                    onClick={() => navigate(`/workshops/${event._id}`)}
                  >
                    Manage Workshops →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}