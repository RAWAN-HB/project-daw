
import React, { useState } from "react";
import "./sign up.css";

const API_URL = "https://v-nement-scientifique.onrender.com/api/auth/register";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "participant", // default آمن
    institution: "",
    title: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // القائمة الصحيحة تمامًا حسب الـ backend enum
  const roles = [
    { value: "participant", label: "Participant " },
    { value: "communicant", label: "Communicant " },
    { value: "event_organizer", label: "Organisateur de l'événement" },
    { value: "scientific_committee", label: "Membre du Comité Scientifique" },
    { value: "guest_speaker", label: "Conférencier Invité" },
    { value: "workshop_animator", label: "Animateur Workshop" },
    // 'super_admin' مش هنضيفه هنا للأمان (يُضاف يدويًا في الـ DB)
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      institution: form.institution.trim()  ||  "Non spécifié",
      title: form.title.trim()   ||"Non spécifié",
      phone: form.phone.trim()   ||"Non spécifié",
    };

    console.log("Données envoyées au backend :", dataToSend);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json().catch(() => ({ message: "No JSON" }));

      console.log("Statut:", response.status);
      console.log("Réponse complète backend:", result);

      if (!response.ok) {
        // تحسين عرض الخطأ (يعرض الـ error حتى لو 500)
        let errorMsg = result.error || result.message || "Erreur inconnue du serveur";
        alert("خطأ في التسجيل:\n" + errorMsg);
        return;
      }

      alert("Inscription réussie ! Vous serez redirigé vers la page de connexion.");
      window.location.href = "/login"; // redirect تلقائي

    } catch (error) {
      console.error("Fetch error:", error);
      alert("مشكلة في الاتصال بالسيرفر: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Créer un compte</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom (firstName)</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="form-group">
            <label>Prénom (lastName)</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Votre prénom"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="votre.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Au moins 8 caractères"
              required
              minLength="8"
            />
          </div>


<div className="form-group">
            <label>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Établissement / Institution</label>
            <input
              type="text"
              name="institution"
              value={form.institution}
              onChange={handleChange}
              placeholder="Université, entreprise, etc."
            />
          </div>

          <div className="form-group">
            <label>Titre (Dr., Pr., Mr., etc.)</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titre académique ou professionnel"
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+213 XX XXX XXX"
            />
          </div>

          <button type="submit" className="signup-btn">
            S'inscrire
          </button>
        </form>

        <div className="signup-login">
          Vous avez déjà un compte ? <a href="/login">Connexion</a>
        </div>
      </div>
    </div>
  );
}