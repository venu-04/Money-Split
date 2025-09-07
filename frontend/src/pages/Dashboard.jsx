import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AddExpense from "./AddExpense";
import Balance from "./Balance";
import { MdDarkMode } from 'react-icons/md';
import { MdLightMode } from 'react-icons/md';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToAdd, setEmailToAdd] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/group/my-groups", {
          headers: { Authorization: token },
        });
        setGroups(res.data.groups);
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/friends", {
          headers: { Authorization: token },
        });
        setFriends(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
    fetchFriends();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddFriend = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/add-friend",
        { email: emailToAdd },
        { headers: { Authorization: token } }
      );
      alert(res.data.message);
      setEmailToAdd("");
      const updatedFriends = await axios.get("http://localhost:5000/api/users/friends", {
        headers: { Authorization: token },
      });
      setFriends(updatedFriends.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // Helper classes for dark/light mode
  const pageClass = darkMode
    ? "min-h-screen bg-gray-900 text-gray-100 p-6"
    : "min-h-screen bg-gradient-to-r from-blue-50 via-white to-green-50 text-gray-900 p-6";

  const cardClass = darkMode
    ? "bg-gray-800 shadow rounded p-6 backdrop-blur-sm"
    : "bg-white/90 shadow rounded p-6 backdrop-blur-sm";

  const inputClass = darkMode
    ? "border border-gray-600 p-2 rounded w-full bg-gray-700 text-gray-100"
    : "border p-2 rounded w-full";

  const groupItemClass = darkMode
    ? "p-3 border border-gray-700 rounded shadow-sm hover:bg-gray-700"
    : "p-3 border border-gray-200 rounded shadow-sm hover:bg-blue-50";

  const buttonClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium px-4 py-2 rounded"
    : "bg-gray-400 hover:bg-gray-400 text-white font-medium px-4 py-2 rounded";

  return (
    <div className={pageClass}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Dark Mode Toggle & Logout */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name || user?.email}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className={buttonClass}
            >
              {darkMode ? <MdLightMode /> : <MdDarkMode />}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded shadow"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary: Total Balance */}
        <div className={cardClass}>
          <h3 className="text-2xl font-semibold mb-4">Summary</h3>
          <Balance groupId={null} darkMode={darkMode}/>
        </div>

        {/* Grid: Groups + Add Expense */}
<div className="grid md:grid-cols-2 gap-6">
  {/* Groups */}
  <div className={cardClass}>
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xl font-semibold">Your Groups</h3>
      <Link
        to="/create-group"
        className="px-3 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        Create Group
      </Link>
    </div>
    <ul className="space-y-2">
      {groups.length > 0 ? (
        groups.map((group) => (
          <li key={group._id} className={groupItemClass}>
            <Link
              to={`/group/${group._id}`}
              className={
                darkMode
                  ? "text-blue-300 hover:underline"
                  : "text-blue-600 hover:underline"
              }
            >
              {group.name}
            </Link>
          </li>
        ))
      ) : (
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          No groups yet.
        </p>
      )}
    </ul>
  </div>



          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-3">Add Expense</h3>
            <button
              onClick={() => setShowAddExpense(prev => !prev)}
              className={buttonClass + " mb-4"}
            >
              {showAddExpense ? "Hide Expense Form" : "➕ Add Expense"}
            </button>
            {showAddExpense && (
              <div className={darkMode ? "bg-gray-700 p-4 border border-gray-600 rounded shadow-md" : "bg-white p-4 border rounded shadow-md"}>
                <AddExpense darkMode={darkMode}/>
              </div>
            )}
          </div>
        </div>

        {/* Friends */}
        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-3">Your Friends</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Enter friend's email"
              value={emailToAdd}
              onChange={(e) => setEmailToAdd(e.target.value)}
              className={inputClass}
            />
            <button onClick={handleAddFriend} className={buttonClass}>
              Invite
            </button>
          </div>
          <ul className="space-y-1">
            {friends.length > 0 ? (
              friends.map((f) => (
                <li key={f._id}>{f.name} ({f.email})</li>
              ))
            ) : (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No friends added yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
