import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./superadmin.css";

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

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});

  // Page protection: only super_admin can access
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "super_admin") {
      alert("Access Denied. Super Admin only.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all users
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

        let usersArray = [];

        if (Array.isArray(response.data)) {
          usersArray = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          usersArray = response.data.users;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          usersArray = response.data.data;
        } else if (response.data.data?.users && Array.isArray(response.data.data.users)) {
          usersArray = response.data.data.users;
        } else {
          console.error("Unexpected format:", response.data);
          setError("Unexpected data format.");
          setLoading(false);
          return;
        }

        setUsers(usersArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Check permissions or server.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Update user role
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

      alert(`Role updated successfully to: ${newRole.replace("_", " ")}`);
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update role. Check permissions.");
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Activate / Deactivate user
  const toggleActive = async (userId, isActive) => {
    const token = localStorage.getItem("token");
    setUpdating((prev) => ({ ...prev, [userId]: true }));

    const action = isActive ? "deactivate" : "activate";

    try {
      await axios.put(
        `${API_URL}/users/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !isActive } : u))
      );

      alert(`User ${isActive ? "deactivated" : "activated"} successfully.`);
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
    <div className="superadmin-dashboard">
      <div className="container">
        <h1>Super Admin Dashboard</h1>
        <p>Full management of all users in the system</p>

        <div className="stats">
          <span>Total Users: <strong>{users.length}</strong></span>
        </div>

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
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {user.firstName || "—"} {user.lastName || ""}
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