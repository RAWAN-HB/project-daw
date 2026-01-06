import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle } from "lucide-react";

function EvaluationForm({ proposal, onSubmit, onBack }) {
  const existing = proposal.evaluation;
  const isReadOnly = !!existing;

  const [scientificQuality, setScientificQuality] = useState(existing?.scientificQuality || 5);
  const [innovation, setInnovation] = useState(existing?.innovation || 5);
  const [methodology, setMethodology] = useState(existing?.methodology || 5);
  const [feasibility, setFeasibility] = useState(existing?.feasibility || 5);
  const [impact, setImpact] = useState(existing?.impact || 5);
  const [decision, setDecision] = useState(existing?.decision || "accepted");
  const [comments, setComments] = useState(existing?.comments || "");
  const [evaluatorName, setEvaluatorName] = useState(existing?.evaluatorName || "");

  const overallScore = (
    (scientificQuality + innovation + methodology + feasibility + impact) / 5
  ).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return onBack();

    onSubmit({
      proposalId: proposal.id,
      scientificQuality,
      innovation,
      methodology,
      feasibility,
      impact,
      overallScore: Number(overallScore),
      decision,
      comments,
      evaluatorName,
      evaluationDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div style={styles.page}>
      {/* Back */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} /> Retour
      </button>

      {/* Proposal Card */}
      <div style={styles.card}>
        <h2>{proposal.title}</h2>
        <p><strong>Auteur :</strong> {proposal.author}</p>
        <p><strong>Institution :</strong> {proposal.institution}</p>
        <p><strong>Date :</strong> {new Date(proposal.submittedDate).toLocaleDateString("fr-FR")}</p>

        {/* PDF Preview */}
        <div style={{ marginTop: 20 }}>
          <strong>Résumé (PDF)</strong>
          {proposal.resumeUrl ? (
            <iframe
              src={proposal.resumeUrl}
              title="Résumé PDF"
              style={styles.iframe}
            />
          ) : (
            <p style={{ color: "#888", marginTop: 10 }}>
              Aucun résumé PDF (placeholder)
            </p>
          )}
        </div>
      </div>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Evaluator */}
        <div style={styles.field}>
          <label>Nom de l’évaluateur</label>
          <input
            type="text"
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
            required
            disabled={isReadOnly}
            style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Scores */}
        <Score label="Qualité scientifique" value={scientificQuality} onChange={setScientificQuality} disabled={isReadOnly} />
        <Score label="Innovation" value={innovation} onChange={setInnovation} disabled={isReadOnly} />
        <Score label="Méthodologie" value={methodology} onChange={setMethodology} disabled={isReadOnly} />
        <Score label="Faisabilité" value={feasibility} onChange={setFeasibility} disabled={isReadOnly} />
        <Score label="Impact" value={impact} onChange={setImpact} disabled={isReadOnly} />

        <p style={styles.score}>Note globale : {overallScore}/10</p>

        {/* Decision Blocks */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold" }}>Décision</label>
          <div style={styles.decisionGrid}>
            <DecisionBlock
              icon={<CheckCircle />}
              label="Accepté"
              value="accepted"
              selected={decision}
              onSelect={setDecision}
              color="#16a34a"
              disabled={isReadOnly}
            />
            <DecisionBlock
              icon={<AlertCircle />}
              label="À réviser"
              value="to-revise"
              selected={decision}
              onSelect={setDecision}
              color="#f59e0b"
              disabled={isReadOnly}
            />
            <DecisionBlock
              icon={<XCircle />}
              label="Refusé"
              value="rejected"
              selected={decision}
              onSelect={setDecision}
              color="#dc2626"
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold" }}>Commentaires</label>
          <textarea
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
            disabled={isReadOnly}
            style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        {/* Buttons */}
        <div style={styles.actions}>
          <button type="button" onClick={onBack}>
            {isReadOnly ? "Fermer" : "Annuler"}
          </button>
          {!isReadOnly && <button type="submit">Soumettre</button>}
        </div>
      </form>
    </div>
  );
}

/* ---------- Components ---------- */

function Score({ label, value, onChange, disabled }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>{label} : {value}/10</label>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function DecisionBlock({ icon, label, value, selected, onSelect, color, disabled }) {
  const active = selected === value;

  return (
    <div
      onClick={() => !disabled && onSelect(value)}
      style={{
        ...styles.decisionBlock,
        borderColor: active ? color : "#ddd",
        background: active ? `${color}15` : "#fff",
        cursor: disabled ? "default" : "pointer"
      }}
    >
      <div style={{ color }}>{icon}</div>
      <strong>{label}</strong>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: {
    maxWidth: 750,
    margin: "40px auto",
    fontFamily: "system-ui, sans-serif"
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    background: "#f3f4f6",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  iframe: {
    width: "100%",
    height: 500,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginTop: 10
  },
  field: {
    marginBottom: 20
  },
  score: {
    textAlign: "center",
    fontWeight: "bold",
    margin: "15px 0"
  },
  decisionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 10
  },
  decisionBlock: {
    padding: 16,
    border: "2px solid #ddd",
    borderRadius: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10
  }
};

// تمت الإضافة كما طلبت
export default EvaluationForm;