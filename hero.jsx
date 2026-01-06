export function Hero() {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #0047ff, #0080ff, #00b4ff)",
        color: "#fff",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 20px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "center"
          }}
        >
          {/* TEXT SECTION */}
          <div>
            <h1
              style={{
                fontSize: 40,
                fontWeight: "bold",
                marginBottom: 20
              }}
            >
              Comité Scientifique
            </h1>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 500,
                opacity: 0.9,
                marginBottom: 20
              }}
            >
              Évaluation des Propositions de Recherche
            </h2>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                opacity: 0.9,
                maxWidth: 520,
                marginBottom: 30
              }}
            >
              Plateforme de gestion et d'évaluation des propositions scientifiques.
              Examinez les soumissions, évaluez la qualité scientifique,
              l'innovation et la méthodologie.
            </p>

            <button
              style={{
                background: "#fff",
                color: "#0047ff",
                border: "none",
                padding: "14px 28px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer"
              }}
              onMouseOver={(e) => (e.target.style.background = "#f1f5ff")}
              onMouseOut={(e) => (e.target.style.background = "#ffffff")}
            >
              Commencer l'évaluation
            </button>
          </div>

          {/* IMAGE SECTION (hidden on small screens via JS-less trick) */}
          <div
            style={{
              display: window.innerWidth >= 1024 ? "block" : "none"
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1757833155170-211a15494193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Scientific Committee Meeting"
              style={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: 16,
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
