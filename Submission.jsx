import { useState } from "react";
import { Send } from "lucide-react";
import "./Submission.css";

export default function SubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    type: "oral",
    category: "",
    abstract: "",
    keywords: "",
    coAuthorsArray: [],
  });

  const [proposalFile, setProposalFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "https://v-nement-scientifique.onrender.com/api/cfp";
  const EVENT_ID = "507f1f77bcf86cd799439011";

  const handleFileChange = (e) => setProposalFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login again");

    if (!formData.title) return alert("Title is required");
    if (!formData.abstract) return alert("Abstract is required");
    if (!formData.category) return alert("Category is required");
    if (!formData.type) return alert("Presentation Type is required");
    if (!proposalFile) return alert("Proposal file is required");

    const data = new FormData();
    data.append("event", EVENT_ID);
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("category", formData.category);
    data.append("presentationType", formData.type);

    formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .forEach((k) => data.append("keywords[]", k));

    formData.coAuthorsArray.forEach((co) =>
      data.append("coAuthors[]", JSON.stringify(co))
    );

    data.append("proposal", proposalFile);

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Submission failed");

      alert("Proposal submitted successfully!");

      window.dispatchEvent(
        new CustomEvent("newProposalAdded", { detail: result })
      );

      setFormData({
        title: "",
        type: "oral",
        category: "",
        abstract: "",
        keywords: "",
        coAuthorsArray: [],
      });
      setProposalFile(null);
    } catch (err) {
      alert(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submission-container">
      <div className="submission-card">
        <div className="submission-header">
          <h2>Submit a Presentation Proposal</h2>
          <p>All proposals will be submitted to the single event.</p>
        </div>

        <form className="submission-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="form-group">
            <label>
              Presentation Title <span>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* TYPE */}
          <div className="form-group">
            <label>
              Presentation Type <span>*</span>
            </label>
            <div className="type-grid">
              {["oral", "poster", "affichée"].map((t) => (
                <label
                  key={t}
                  className={`type-card ${
                    formData.type === t ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value={t}
                    checked={formData.type === t}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  />
                  <span className="icon">
                    {t === "oral" ? "🎤" : t === "poster" ? "🖼️" : "📋"}
                  </span>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label>
              Category <span>*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Select a category</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          {/* ABSTRACT */}
          <div className="form-group">
            <label>
              Abstract <span>*</span>
            </label>
            <textarea
              rows="7"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              required
            />
          </div>

          {/* KEYWORDS */}
          <div className="form-group">
            <label>Keywords (comma separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
            />
          </div>

          {/* CO AUTHORS */}
          <div className="form-group">
            <label>Co-authors</label>
            {formData.coAuthorsArray.map((co, idx) => (
              <div key={idx} className="coauthor-row">
                <input
                  type="text"
                  placeholder="Name"
                  value={co.name}
                  onChange={(e) => {
                    const newCo = [...formData.coAuthorsArray];
                    newCo[idx].name = e.target.value;
                    setFormData({ ...formData, coAuthorsArray: newCo });
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={co.email}
                  onChange={(e) => {
                    const newCo = [...formData.coAuthorsArray];
                    newCo[idx].email = e.target.value;
                    setFormData({ ...formData, coAuthorsArray: newCo });
                  }}
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={co.institution}
                  onChange={(e) => {
                    const newCo = [...formData.coAuthorsArray];
                    newCo[idx].institution = e.target.value;
                    setFormData({ ...formData, coAuthorsArray: newCo });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newCo = formData.coAuthorsArray.filter(
                      (_, i) => i !== idx
                    );
                    setFormData({ ...formData, coAuthorsArray: newCo });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  coAuthorsArray: [
                    ...formData.coAuthorsArray,
                    { name: "", email: "", institution: "" },
                  ],
                })
              }
            >
              Add Co-author
            </button>
          </div>

          {/* PROPOSAL FILE — UI UPDATED ONLY */}
          <div className="form-group">
            <label>
              Proposal File (PDF, DOC, DOCX) <span>*</span>
            </label>

            <div className="upload-dropzone">
              <div className="upload-icon">📄</div>
              <p>Drag and drop your proposal here</p>
              <p>or click to browse</p>

              <label className="upload-button">
                Select File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  hidden
                  required
                />
              </label>
            </div>

            {proposalFile && (
              <div className="helper success">
                ✔ {proposalFile.name} selected
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={submitting}>
              <Send size={18} /> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}     