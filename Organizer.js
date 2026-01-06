import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Organizer.css";

const API_URL = "https://v-nement-scientifique.onrender.com/api/auth";

const ROLE_OPTIONS = [
  "participant",
  "communicant",
  "event_organizer",
  "scientific_committee",
  "guest_speaker",
  "workshop_animator",
  "super_admin",
];

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});

  // Protect page
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "event_organizer") {
      alert("Access denied. Event Organizer only.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch users with robust response handling
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Full response from /users:", response.data);

        let usersArray = [];

        // Handle different possible response structures
        if (Array.isArray(response.data)) {
          usersArray = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          usersArray = response.data.users;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          usersArray = response.data.data;
        } else if (response.data.data?.users && Array.isArray(response.data.data.users)) {
          usersArray = response.data.data.users;
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Unexpected data format from server.");
          setLoading(false);
          return;
        }

        setUsers(usersArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Check endpoint or permissions.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const updateRole = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    setUpdating((prev) => ({ ...prev, [userId]: true }));

    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update role.");
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const toggleActive = async (userId, isActive) => {
    const token = localStorage.getItem("token");
    setUpdating((prev) => ({ ...prev, [userId]: true }));

    const endpoint = isActive ? "deactivate" : "activate";

    try {
      await axios.put(
        `${API_URL}/users/${userId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="organizer-dashboard">
      <div className="container">
        <h1>Event Organizer Dashboard</h1>
        <p>Manage participants: update roles and activation status.</p>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        disabled={updating[user._id]}
                        className="role-select"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`status ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(user._id, user.isActive)}
                        disabled={updating[user._id]}
                        className={`btn-toggle ${user.isActive ? "deactivate" : "activate"}`}
                      >
                        {updating[user._id]
                          ? "Updating..."
                          : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}