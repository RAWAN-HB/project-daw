import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://v-nement-scientifique.onrender.com/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      console.log("✅ رد السيرفر الكامل:", JSON.stringify(response.data, null, 2));

      // استخراج الـ token
      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.jwt ||
        response.data.access_token ||
        response.data.authToken ||
        response.data.sessionToken ||
        response.data.data?.token ||
        response.data.user?.token ||
        response.data.result?.token ||
        response.data.profile?.token;

      if (!token) {
        throw new Error("لم يتم العثور على رمز الدخول (token) في الرد.");
      }

      // استخراج الـ role
      let role = "participant";
      const roleSources = [
        response.data.role,
        response.data.user?.role,
        response.data.data?.role,
        response.data.data?.user?.role,
        response.data.result?.role,
        response.data.profile?.role,
      ];
      for (const r of roleSources) {
        if (r) {
          role = r;
          break;
        }
      }

      // استخراج بيانات المستخدم من أي مكان في الـ response
      const userSources = [
        response.data.user,
        response.data.data,
        response.data.result,
        response.data.profile,
        response.data,
      ];

      let userData = {};
      for (const src of userSources) {
        if (src && typeof src === "object") {
          userData = src;
          break;
        }
      }

      // استخراج الاسم الكامل بأقصى مرونة ممكنة
      let fullName =
        userData.fullName ||
        userData.name ||
        userData.displayName ||
        userData.username ||
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
        userData.email?.split("@")[0] ||  // جزء قبل @ من الإيميل
        email.split("@")[0] ||           // fallback للإيميل اللي دخلته
        "Utilisateur";

      // تنسيق الاسم: كابيتال لكل كلمة + إزالة مسافات زائدة
      fullName = fullName
        .trim()
        .split(" ")
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""))
        .join(" ")
        .replace(/\s+/g, " ");

      // لو الاسم فاضي أو إيميل فقط، نجعله أجمل
      if (fullName === "" || fullName.toLowerCase() === email.toLowerCase().split("@")[0]) {
        fullName = fullName.charAt(0).toUpperCase() + fullName.slice(1);
      }

      const institution =
        userData.institution ||
        userData.organization ||
        userData.university ||
        userData.affiliation ||
        "Institution non spécifiée";

      const domain =
        userData.domain ||
        userData.field ||
        userData.specialty ||
        userData.researchArea ||
        "Domaine non spécifié";

      // حفظ كل البيانات في localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("user", JSON.stringify({
        name: fullName,
        institution: institution,
        domain: domain,
        email: userData.email || email,
      }));

      console.log("✅ تم استخراج وحفظ الاسم الحقيقي:", fullName);
      console.log("✅ بيانات المستخدم المحفوظة:", { fullName, institution, domain });

      // خريطة التوجيه حسب الـ role
      const roleMap = {
        super_admin: "/Superadmin",
        event_organizer: "/organizer",
        communicant: "/DashboardContent",
        scientific_committee: "/cs",
        guest_speaker: "/event",
        workshop_animator: "/WorkshopDetailedPage",
        participant: "/participant",
      };

      const redirectPath = roleMap[role] || "/participant";

      alert(`Connexion réussie ! Bienvenue, ${fullName} 👋`);

      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("❌ خطأ في تسجيل الدخول:", err);
      let errorMsg = "Email ou mot de passe incorrect";
      if (err.response?.data?.error) errorMsg = err.response.data.error;
      else if (err.response?.data?.message) errorMsg = err.response.data.message;
      else if (err.message) errorMsg = err.message;

      alert("خطأ في تسجيل الدخول:\n" + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={loading}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" disabled={loading} /> Se souvenir de moi
            </label>
            <span className="register-text">Mot de passe oublié ?</span>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="register-link">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="register-text">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}