import {
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export function ProposalList({ proposals, onEvaluate }) {

  const getStatusInfo = (status) => {
    switch (status) {
      case "accepted":
        return { label: "Accepté", icon: CheckCircle2, color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" };
      case "rejected":
        return { label: "Refusé", icon: XCircle, color: "#c62828", bg: "#ffebee", border: "#ef9a9a" };
      case "to-revise":
        return { label: "À réviser", icon: AlertCircle, color: "#ef6c00", bg: "#fff3e0", border: "#ffcc80" };
      default:
        return { label: "En attente", icon: Clock, color: "#1565c0", bg: "#e3f2fd", border: "#90caf9" };
    }
  };

  const pendingCount = proposals.filter(p => p.status === "pending").length;
  const evaluatedCount = proposals.length - pendingCount;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 32, backgroundColor: "#0047ff", borderRadius: 4 }} />
          <h2 style={{ color: "#1e2875", margin: 0 }}>Liste des Propositions</h2>
        </div>
        <p style={{ color: "#555", marginTop: 10, maxWidth: 700 }}>
          Consultez et évaluez les propositions de recherche soumises par les chercheurs.
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
        <StatCard label="Total des propositions" value={proposals.length} gradient="linear-gradient(135deg, #0047ff, #0080ff)" />
        <StatCard label="En attente" value={pendingCount} gradient="linear-gradient(135deg, #ff6b00, #ff9500)" />
        <StatCard label="Évaluées" value={evaluatedCount} gradient="linear-gradient(135deg, #00c851, #00e676)" />
      </div>

      {/* PROPOSALS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
        {proposals.map((proposal) => {
          const status = getStatusInfo(proposal.status);
          const StatusIcon = status.icon;

          return (
            <div key={proposal.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: 20 }}>

                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <FileText size={22} color="#0047ff" />
                  <h3 style={{ margin: 0, color: "#1e2875" }}>{proposal.title}</h3>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "#555", fontSize: 14, marginBottom: 12 }}>
                  <span>{proposal.author}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Building2 size={14} /> {proposal.institution}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={14} /> {new Date(proposal.submittedDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <p style={{ color: "#333", lineHeight: 1.6 }}>{proposal.abstract}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, borderTop: "1px solid #eee", paddingTop: 14 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${status.border}`,
                    background: status.bg,
                    color: status.color,
                    fontSize: 14
                  }}>
                    <StatusIcon size={16} />
                    {status.label}
                  </div>

                  <button
                    onClick={() => onEvaluate(proposal.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: proposal.status === "pending" ? "#0047ff" : "#eee",
                      color: proposal.status === "pending" ? "#fff" : "#333"
                    }}
                  >
                    {proposal.status === "pending" ? "Évaluer" : "Voir l'évaluation"}
                  </button>
                </div>
              </div>

              {proposal.evaluation && (
                <div style={{ background: "#f8faff", borderTop: "1px solid #ddd", padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, textAlign: "center", fontSize: 14 }}>
                    {Object.entries(proposal.evaluation).map(([key, value]) => (
                      <div key={key}>
                        <div style={{ color: "#666" }}>{key}</div>
                        <strong style={{ color: "#0047ff" }}>{value}/10</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function StatCard({ label, value, gradient }) {
  return (
    <div style={{
      background: gradient,
      color: "#fff",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    }}>
      <div style={{ opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}
