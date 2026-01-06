import { useState } from "react";
import { FileText, Star, Upload, Calendar } from "lucide-react";
import AuthorOverview  from "./AuthorOverview";
import { EvaluationsList } from "./EvaluationsList";
import Submission from "../pages/Submission";
import "./DashboardContent.css";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText size={18} /> },
    { id: "submit", label: "Submit", icon: <Calendar size={18} /> },
    { id: "evaluations", label: "Evaluations", icon: <Star size={18} /> },
  
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h2>Your Author Space Awaits!</h2>
          <p>Submit, review, and engage—everything you need in one place.</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {activeTab === "overview" && <AuthorOverview />}
        {activeTab === "submit" && <Submission/>}
        {activeTab === "evaluations" && <EvaluationsList />}
       
      </main>
    </div>
  );
}

