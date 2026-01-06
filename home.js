import React, { useEffect, useState } from "react";
import "./home.css";

import event1 from "../images/event1.jpg";
import event2 from "../images/event222.jpg";
import event3 from "../images/event3.jpg";
import event4 from "../images/event4.jpg";
import event5 from "../images/event5.jpg";
import event6 from "../images/event6.jpg";
import event8 from "../images/event8.jpg";
import event9 from "../images/event9.jpg";
import event10 from "../images/event10.jpg";
import MIT from "../images/MIT.jpg";
import USTHB from "../images/USTHB.jpg";
import GRS from "../images/GRS.jpg";
import CNRS from "../images/CNRS.jpg";
import UN1 from "../images/UN1.jpg";
function Home() {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 0, minutes: 0, seconds: 0 });

  const events = [
    { image: event1, title: "Conférence Internationale" },
    { image: event2, title: "Workshop IA & Data" },
    { image: event3, title: "Journée Scientifique" },
    { image: event4, title: "Séminaire de Recherche" },
    { image: event5, title: "Formation Doctorants" },
    { image: event6, title: "Projet Innovation" },
    { image: event8, title: "Robotics Challenge" },
    { image: event9, title: "Expo Scientifique" },
    { image: event10, title: "Présentation Technologique" },
  ];

  useEffect(() => {
    // Fade-in on scroll + فوري
    const elements = document.querySelectorAll(".fade-in");
    const showElements = () => {
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };
    showElements();
    window.addEventListener("scroll", showElements);

    // Loader
    setTimeout(() => setLoading(false), 1000);

    // Timer للعرض الخاص
   const endDate = new Date();
endDate.setDate(endDate.getDate() + 70); // ajoute 70 jours

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", showElements);
      clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Chargement de la plateforme...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <header className="hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/videos/myvideo.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bienvenue sur la plateforme des événements scientifiques</h1>
          <p>Congrès, séminaires, workshops et journées scientifiques</p>
          <a href="/evenements">
            <button className="cta-button">Découvrir les événements</button>
          </a>
        </div>
      </header>

      {/* Photos */}
      <section className="home-photos">
        <h2>Événements en images</h2>
        <div className="photo-grid">
          {events.map((event, index) => (
            <div key={index} className="photo-card fade-in visible">
              <img src={event.image} alt={event.title} />
              <p>{event.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events">
        <div className="container">
          <h2 className="fade-in visible">Prochains événements</h2>
          <div className="events-list">
            <div className="event-item fade-in visible">
              <h3>Conférence IA 2026</h3>
              <p className="date">15-17 Mars 2026</p>
              <p>Découvrez les dernières avancées en intelligence artificielle.</p>
              <a href="/evenements" className="event-link">En savoir plus →</a>
            </div>
            <div className="event-item fade-in visible">
              <h3>Workshop Big Data</h3>
              <p className="date">22 Avril 2026</p>
              <p>Atelier pratique sur le traitement des données massives.</p>
              <a href="/evenements" className="event-link">En savoir plus →</a>
            </div>
            <div className="event-item fade-in visible">
              <h3>Journée de la Robotique</h3>
              <p className="date">10 Mai 2026</p>
              <p>Démonstrations et compétitions de robots autonomes.</p>
              <a href="/evenements" className="event-link">En savoir plus →</a>
            </div>
          </div>
          <div className="text-center">
           <a href="/evenements">
  <button className="cta-button secondary">Voir tous les événements</button>
</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="fade-in visible">Pourquoi nous choisir ?</h2>
          <div className="features-grid">
            <div className="feature-card fade-in visible">
              <div className="icon">🔬</div>
              <h3>Excellence scientifique</h3>
              <p>Des intervenants reconnus internationalement et des thématiques d'avant-garde.</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="icon">🌍</div>
              <h3>Communauté internationale</h3>
              <p>Participez à des échanges avec des chercheurs du monde entier.</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="icon">🎓</div>
              <h3>Formation continue</h3>
              <p>Crédits de formation et certifications pour doctorants et professionnels.</p>
            </div>
            <div className="feature-card fade-in visible">
              <div className="icon">🤝</div>
              <h3>Networking</h3>
              <p>Rencontrez partenaires, collaborateurs et futurs employeurs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="fade-in visible">Ils parlent de nous</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card fade-in visible">
              <p className="quote">"Une organisation impeccable et des conférences très enrichissantes."</p>
              <p className="author">— Dr. Marie Dupont, CNRS</p>
            </div>
            <div className="testimonial-card fade-in visible">
              <p className="quote">"Le meilleur workshop auquel j'ai participé cette année !"</p>
              <p className="author">— Prof. Ahmed Benali, Université de Tunis</p>
            </div>
            <div className="testimonial-card fade-in visible">
              <p className="quote">"Des opportunités de networking exceptionnelles."</p>
              <p className="author">— Sarah Leclerc, Doctorante INRIA</p>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="news-section">
        <div className="container">
          <h2 className="fade-in visible">Actualités récentes</h2>
          <div className="news-grid">
            <div className="news-card fade-in visible">
              <img src={event3} alt="News 1" />
              <div className="news-content">
                <h3>Ouverture des inscriptions pour la Conférence IA 2026</h3>
                <p className="date">15 Décembre 2025</p>
                <p>Les inscriptions sont officiellement ouvertes. Réservez votre place dès maintenant !</p>
                <a href="/evenements" className="news-link">Lire plus →</a>
              </div>
            </div>
            <div className="news-card fade-in visible">
              <img src={event8} alt="News 2" />
              <div className="news-content">
                <h3>Partenariat avec l'Université d'Alger</h3>
                <p className="date">10 Décembre 2025</p>
                <p>Nouveau partenariat stratégique pour renforcer la recherche en robotique.</p>
                <a href="/evenements" className="news-link">Lire plus →</a>
              </div>
            </div>
            <div className="news-card fade-in visible">
              <img src={event9} alt="News 3" />
              <div className="news-content">
                <h3>Résultats du Robotics Challenge 2025</h3>
                <p className="date">1 Décembre 2025</p>
                <p>L'équipe "Algeria Bots" remporte la première place !</p>
                <a href="/evenements" className="news-link">Lire plus →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
     <section className="partners-section">
  <div className="container">
    <h2 className="fade-in visible">Nos partenaires</h2>
    <div className="partners-grid">
      {/* صورك الحقيقية */}
      <div className="partner-logo fade-in visible">
       <a href="#"><img src={UN1} alt="UN1" /></a>
      </div>
      <div className="partner-logo fade-in visible">
     <a href="#"><img src={CNRS} alt="CNRS" /></a>
      </div>
      <div className="partner-logo fade-in visible">
          <a href="#"><img src={USTHB} alt="USTHB" /></a>
      </div>
      <div className="partner-logo fade-in visible">
          <a href="#"><img src={MIT} alt="MIT" /></a>
      </div>
      <div className="partner-logo fade-in visible">
          <a href="#"><img src={GRS} alt="GOOGLE RESEARCHE" /></a>
      </div>
    </div>
  </div>
</section>

      {/* Highlights Video */}
      <section className="highlights-video">
        <div className="container">
          <h2 className="fade-in visible">Revivez les meilleurs moments</h2>
          <div className="video-wrapper fade-in visible">
<iframe src="https://www.youtube.com/embed/tc6m5pWzW70" title="Highlights Conférence Mondiale des Robots 2025" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
          </div>
          <p className="video-caption fade-in visible">Best-of des conférences scientifiques 2025</p>
        </div>
      </section>

      {/* World Map */}
      <section className="world-map">
        <div className="container">
          <h2 className="fade-in visible">Notre présence dans le monde</h2>
          <p className="map-subtitle fade-in visible">Plus de 5000 participants de 40 pays différents</p>
          <div className="map-placeholder fade-in visible">
            <img src="https://via.placeholder.com/1200x600/0077b6/ffffff?text=Carte+du+Monde+Interactive" alt="World Map" />
            <div className="map-overlay">
              <span>🌍 Interactive Map Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="fade-in visible">Questions fréquentes</h2>
          <div className="faq-list">
            <div className="faq-item fade-in visible">
              <input type="checkbox" id="faq1" />
              <label htmlFor="faq1">Comment s'inscrire à un événement ?</label>
              <div className="faq-content">
                <p>Rendez-vous sur la page Événements, choisissez votre événement et cliquez sur "S'inscrire". Le paiement est sécurisé.</p>
              </div>
            </div>
            <div className="faq-item fade-in visible">
              <input type="checkbox" id="faq2" />
              <label htmlFor="faq2">Les événements sont-ils gratuits ?</label>
              <div className="faq-content">
                <p>Certains workshops sont gratuits, les conférences internationales sont payantes mais avec réduction pour étudiants.</p>
              </div>
            </div>
            <div className="faq-item fade-in visible">
              <input type="checkbox" id="faq3" />
              <label htmlFor="faq3">Y a-t-il des certificats de participation ?</label>
              <div className="faq-content">
                <p>Oui, un certificat officiel est délivré à chaque participant à la fin de l'événement.</p>
              </div>
            </div>
            <div className="faq-item fade-in visible">
              <input type="checkbox" id="faq4" />
              <label htmlFor="faq4">Puis-je présenter ma recherche ?</label>
              <div className="faq-content">
                <p>Absolument ! Soumettez votre abstract via la page "Soumission" avant la date limite.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA مع Timer */}
      <section className="big-cta parallax">
        <div className="big-cta-content">
          <h2 className="fade-in visible">Prêt à faire partie de l'avenir scientifique ?</h2>
          <p className="fade-in visible">Inscrivez-vous maintenant et recevez -20% sur votre premier événement !</p>
          <div className="big-buttons fade-in visible">
            <a href="/evenements">
              <button className="cta-button huge">Réserver ma place</button>
            </a>
            <a href="/contact">
              <button className="cta-button huge outline">Nous contacter</button>
            </a>
          </div>
          <p className="offer-timer fade-in visible">
            Offre limitée - Termine dans : <strong>{timeLeft.days}j {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2 className="fade-in visible">Restez informé</h2>
          <p className="fade-in visible">Recevez les annonces des prochains événements directement dans votre boîte mail.</p>
          <form className="newsletter-form fade-in visible">
            <input type="email" placeholder="Votre adresse e-mail" required />
            <button type="submit" className="cta-button">S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;