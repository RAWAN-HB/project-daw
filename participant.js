import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/* Icons */
const CalendarIcon = () => <span className="icon">📅</span>;
const LocationIcon = () => <span className="icon">📍</span>;
const BellIcon = () => <span className="icon">🔔</span>;
const MessageIcon = () => <span className="icon">✉️</span>;
const LogoutIcon = () => <span className="icon">🚪</span>;
const DownloadIcon = () => <span className="icon">⬇️</span>;
const CheckIcon = () => <span className="icon">✓</span>;

const API_URL = "https://v-nement-scientifique.onrender.com/api";

const Participant = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const events = [
    {
      id: 1,
      title: "Workshop Intelligence Artificielle et Imagerie Médicale",
      date: "10-12 Décembre 2025",
      location: "En ligne",
      status: "termine",
      attestationAvailable: true,
    },
    {
      id: 2,
      title: "Workshop Scientifique sur l'IA en Médecine",
      date: "20 Janvier 2026",
      location: "Alger",
      status: "futur",
      attestationAvailable: false,
    },
  ];

  const notifications = [
    "Votre attestation est disponible",
    "Programme mis à jour",
    "Bienvenue dans votre espace participant",
  ];

  useEffect(() => {
    const loadUser = async () => {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous connecter");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = {
          name: res.data.name || "Utilisateur",
          institution: res.data.institution || "Institution inconnue",
        };

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        setError("Erreur de chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Chargement...</p>;
  }

  return (
    <>
      {/* ===== CSS INSIDE SAME FILE ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", Tahoma, sans-serif;
        }

        body {
          background: #f4f6f9;
        }

        .page-full-height {
          min-height: 100vh;
        }

        header {
          background: #0047ff;
          color: white;
          padding: 15px 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
        }

        .wrapper {
          max-width: 1200px;
          margin: auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        nav {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        nav a {
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-avatar {
          background: white;
          color: #0047ff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        main {
          max-width: 1200px;
          margin: auto;
          padding: 120px 20px 40px;
        }

        .greeting-block {
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .events-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .event-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .event-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .event-status-futur {
          background: #e6f0ff;
          color: #0047ff;
        }

        .event-status-termine {
          background: #e8f9ee;
          color: #1a7f37;
        }

        .event-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .live-access-btn {
          background: #0047ff;
          color: white;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          text-decoration: none;
        }

        .download-certificate-btn {
          background: #0036c9;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .icon {
          margin-right: 6px;
        }
      `}</style>

      {/* ===== PAGE ===== */}
      <div className="page-full-height">
        <header>
          <div className="wrapper">
            <h1>SciHealth Events</h1>
            <nav>
              <Link to="/evenements">Mes événements</Link>
              <Link to="/messages"><MessageIcon /> Messages</Link>
              <div className="profile-section">
                <div>
                  <p>{user?.name}</p>
                  <small>{user?.institution}</small>
                </div>
                <div className="profile-avatar">{user?.name?.charAt(0)}</div>
              </div>
              <button onClick={handleLogout} style={{ background: "none", border: "none", color: "white" }}>
                <LogoutIcon />
              </button>
            </nav>
          </div>
        </header>

        <main>
          <div className="greeting-block">
            <h2>Bienvenue, {user?.name} 👋</h2>
            <p>Voici vos événements scientifiques.</p>
          </div>

          <section>
            <h3>Mes événements</h3>
            <div className="events-list">
              {events.map(event => (
                <div key={event.id} className="event-item">
                  <span className={`event-status event-status-${event.status}`}>
                    {event.status === "futur" ? "À venir" : "Terminé"}
                  </span>

                  <h4>{event.title}</h4>
                  <p><CalendarIcon /> {event.date}</p>
                  <p><LocationIcon /> {event.location}</p>

                  <div className="event-actions">
                    <Link to="/evenements" className="live-access-btn">
                      Accéder
                    </Link>

                    {event.attestationAvailable && (
                      <button className="download-certificate-btn">
                        <DownloadIcon /> Télécharger l'attestation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Participant;
