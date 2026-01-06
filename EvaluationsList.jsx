import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import "./EvaluationsList.css";

const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api";

export function EvaluationsList() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to view evaluations.");
          setEvaluations([]);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Step 1: fetch user's own proposals
        const proposalsRes = await axios.get(`${API_BASE_URL}/cfp/my-proposals`, config);
        const proposals = Array.isArray(proposalsRes.data) ? proposalsRes.data : [];

        // Step 2: fetch evaluation for each proposal
        const proposalsWithEvaluations = await Promise.all(
          proposals.map(async (proposal) => {
            try {
              const evalRes = await axios.get(
                `${API_BASE_URL}/evaluations/proposal/${proposal._id}`,
                config
              );
              return { ...proposal, reviews: evalRes.data.reviews || [], overallScore: evalRes.data.overallScore };
            } catch (err) {
              // If evaluation not ready yet, keep empty reviews
              return { ...proposal, reviews: [], overallScore: null };
            }
          })
        );

        setEvaluations(proposalsWithEvaluations);
      } catch (err) {
        console.error("Error fetching evaluations:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load evaluations!");
        setEvaluations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading) return <p>Loading evaluations...</p>;
  if (error) return <p>{error}</p>;
  if (evaluations.length === 0) return <p>No evaluations yet for your proposals.</p>;

  return (
    <div className="evaluations-list space-y-6">
      {evaluations.map((evaluation) => (
        <div key={evaluation._id} className="evaluation-card">
          <div className="evaluation-header">
            <div className="evaluation-info">
              <h3>{evaluation.title}</h3>
              <span>{evaluation.category}</span> •{" "}
              <span
                className={`evaluation-status status-${
                  evaluation.status ? evaluation.status.replace(" ", "-") : "default"
                }`}
              >
                {evaluation.status || "Pending"}
              </span>
            </div>

            {evaluation.overallScore && (
              <div className="evaluation-score">
                <Star size={20} className="star-icon" />
                <span>{evaluation.overallScore}/5</span>
              </div>
            )}
          </div>

          <div className="evaluation-reviews">
            {evaluation.reviews && evaluation.reviews.length > 0 ? (
              evaluation.reviews.map((review, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <h4>{review.reviewer}</h4>
                    <div className="review-score">
                      <Star size={16} className="star-icon" /> {review.score}/5
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.comments}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="review-pending">
                <div className="pending-icon">⏳</div>
                <div className="pending-text">Evaluation in progress</div>
                <div className="pending-note">No reviews submitted yet.</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
