import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import axios from "axios";
import "./AuthorOverview.css";
import { useNavigate } from "react-router-dom"; // ✅ Added

export default function AuthorOverview() {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [stats, setStats] = useState([
    { icon: FileText, label: "Propositions soumises", value: "0", textColor: "blue-text", bgColor: "blue-bg" },
    { icon: CheckCircle, label: "Propositions acceptées", value: "0", textColor: "green-text", bgColor: "green-bg" },
    { icon: Clock, label: "En attente", value: "0", textColor: "orange-text", bgColor: "orange-bg" },
    { icon: TrendingUp, label: "Taux d'acceptation", value: "0%", textColor: "purple-text", bgColor: "purple-bg" },
  ]);

  const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api";
  const navigate = useNavigate(); // ✅ Added

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/cfp/my-proposals`, config);

        console.log("Proposals response:", res.data); // Check the backend response

        // Safely extract the array
        const proposals = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        // Update stats
        const total = proposals.length;
        const accepted = proposals.filter(p => p.status === "Accepté").length;
        const pending = proposals.filter(p => !p.status || p.status === "En évaluation").length;
        const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) + "%" : "0%";

        setStats([
          { icon: FileText, label: "Propositions soumises", value: total.toString(), textColor: "blue-text", bgColor: "blue-bg" },
          { icon: CheckCircle, label: "Propositions acceptées", value: accepted.toString(), textColor: "green-text", bgColor: "green-bg" },
          { icon: Clock, label: "En attente", value: pending.toString(), textColor: "orange-text", bgColor: "orange-bg" },
          { icon: TrendingUp, label: "Taux d'acceptation", value: acceptanceRate, textColor: "purple-text", bgColor: "purple-bg" },
        ]);

        // Map proposals to recent submissions
        const mappedSubmissions = proposals.map(p => ({
          title: p.title,
          type: p.presentationType,
          status: p.status || "En évaluation",
          date: p.createdAt?.split("T")[0] || "",
          statusColor:
            p.status === "Accepté" ? "green-status" : p.status === "Rejeté" ? "red-status" : "orange-status",
        }));

        setRecentSubmissions(mappedSubmissions);
      } catch (err) {
        console.error("Error fetching proposals:", err.response?.data || err.message);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div className="author-overview">
      {/* Banner */}
      <div className="welcome-banner">
        <div className="banner-grid">
          <div className="banner-text">
            <h2>WELCOME, Dr. Marie Dupont</h2>
            <p>Prepare your communications for the International Conference 2026.</p>
            <div className="banner-buttons">
              {/* ✅ Added navigation */}
              <button className="btn-primary" onClick={() => navigate("/submission")}>
                NEW SUBMISSION
              </button>
              <button className="btn-secondary" onClick={() => navigate("/evaluation")}>
                VIEW EVALUATIONS
              </button>
            </div>
          </div>
          <div className="banner-image">
            <img
              className="banner-img"
              src="https://images.unsplash.com/photo-1757833155170-211a15494193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Scientific Meeting"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon icon-bg ${stat.bgColor}`}>
              <stat.icon size={24} className={stat.textColor} />
            </div>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="recent-submissions">
        <div className="submissions-header">
          <h3>Vos propositions récentes</h3>
        </div>
        <div className="submissions-list">
          {recentSubmissions.length > 0 ? (
            recentSubmissions.map((sub, i) => (
              <div key={i} className="submission-item">
                <div className="submission-info">
                  <h4>{sub.title}</h4>
                  <div className="submission-meta">
                    <span>{sub.type}</span> • <span>{sub.date}</span>
                  </div>
                </div>
                <div className="submission-status">
                  <span className={`status-dot ${sub.statusColor}`}></span>
                  <span className="status-text">{sub.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune proposition soumise pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}