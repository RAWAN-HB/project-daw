import React, { useState } from "react";
import { Hero } from "./hero"; 
import { ProposalList } from "./ProposalList";
import  EvaluationForm from "./EvaluationForm";



 function Cs() {
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Recherche IA",
      author: "Alice",
      institution: "Université X",
      submittedDate: "2025-11-30",
      abstract: "Étude sur l'IA et ses applications.",
      status: "pending",
    },
    {
      id: 2,
      title: "Énergie renouvelable",
      author: "Bob",
      institution: "Université Y",
      submittedDate: "2025-11-29",
      abstract: "Projet sur l'énergie solaire.",
      status: "accepted",
      evaluation: {
        proposalId: 2,
        scientificQuality: 8,
        innovation: 7,
        methodology: 9,
        feasibility: 8,
        impact: 7,
        overallScore: 7.8,
        decision: "accepted",
        comments: "Très bon projet",
        evaluatorName: "Dr. John",
        evaluationDate: "2025-11-30",
      },
    },
  ]);

  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleEvaluate = (proposalId) => {
    const p = proposals.find((p) => p.id === proposalId) || null;
    setSelectedProposal(p);
  };

  const handleSubmitEvaluation = (evaluation) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === evaluation.proposalId
          ? { ...p, status: evaluation.decision, evaluation }
          : p
      )
    );
    setSelectedProposal(null);
  };

  const handleBack = () => setSelectedProposal(null);

  return (
    <div className="cs-container">
      <Hero />
      <h1>Proposals Dashboard</h1>

      {!selectedProposal ? (
        // Show the list of proposals
        <ProposalList proposals={proposals} onEvaluate={handleEvaluate} />
      ) : (
        // Show the evaluation form for the selected proposal
        <EvaluationForm
          proposal={selectedProposal}
          onSubmit={handleSubmitEvaluation}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default Cs;
