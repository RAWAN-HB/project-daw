import React from "react";
import { useNavigate } from "react-router-dom";
import event1 from "../images/event1.jpg";
import event2 from "../images/event222.jpg";
import event3 from "../images/event3.jpg";

import "./Evenments.css";

function Evenements() {
  const navigate = useNavigate();

  const events = [
    {
      image: event1,
      title: "Congrès sur la Santé",
      description: "Découvrez les dernières avancées médicales et innovations en santé publique.",
    },
    {
      image: event2,
      title: "Science & Tech Events 🧬",
      description: "Découvrez les meilleurs événements scientifiques et technologiques près de chez vous.",
      link: "/myevent",
    },
    {
      image: event3,
      title: "Séminaire Innovation Médicale",
      description: "Échanges approfondis avec des chercheurs et experts du domaine médical.",
    },
  ];

  return (
    <section className="events-section">
      <div className="container">
        <h2 className="section-title">Événements à venir</h2>
        <div className="events-grid">
          {events.map((event, index) => (
            <article key={index} className="event-card">
              <div className="event-image-wrapper">
                <img src={event.image} alt={event.title} className="event-image" />
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <button
                  className="event-button"
                  onClick={() => event.link && navigate(event.link)}
                >
                  En savoir plus
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Evenements;