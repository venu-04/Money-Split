import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AddExpense from "./AddExpense";
import Balance from "./Balance";
import { MdDarkMode, MdLightMode , MdDelete } from "react-icons/md";



export default function Dashboard() {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState({ personal: [], group: [] });
  const [emailToAdd, setEmailToAdd] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchDashboardData = async () => {
      try {
        // const res = await axios.get("http://localhost:5000/api/group/my-groups", {
        const res = await axios.get("https://money-split.onrender.com/api/group/my-groups", {
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
        // const res = await axios.get("http://localhost:5000/api/users/friends", {
        const res = await axios.get("https://money-split.onrender.com/api/users/friends", {
          headers: { Authorization: token },
        });
        setFriends(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchExpenses = async () => {
      if (!user._id) return;
      try {
        // const res = await axios.get(`http://localhost:5000/api/expense/${user._id}`, {
        const res = await axios.get(`https://money-split.onrender.com/api/expense/${user._id}`, {
          headers: { Authorization: token },
        });
        setExpenses({
          personal: res.data.personalExpenses,
          group: res.data.groupExpenses,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
    fetchFriends();
    fetchExpenses();
  }, [token, navigate, user._id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddFriend = async () => {
    try {
      const res = await axios.post(
        // "http://localhost:5000/api/users/add-friend",
        "https://money-split.onrender.com/api/users/add-friend",
        { email: emailToAdd },
        { headers: { Authorization: token } }
      );
      alert(res.data.message);
      setEmailToAdd("");
      // const updatedFriends = await axios.get("http://localhost:5000/api/users/friends", {
      const updatedFriends = await axios.get("https://money-split.onrender.com/api/users/friends", {
        headers: { Authorization: token },
      });
      setFriends(updatedFriends.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handledeleteGroup = async(id) => {
    if(!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")){
      return;
    }

    try {

      // await axios.delete(`http://localhost:5000/api/group/${id}`,{
      await axios.delete(`https://money-split.onrender.com/api/group/${id}`,{
        headers:{Authorization:token}
      });
      alert("Group deleted successfully");

      setGroups((prevGroups) => prevGroups.filter((g) => g._id !== id));

      // navigate("/dashboard");

      

    } catch (error) {
      console.error(error,"Failed to delete group");
    }

  }

  // Tailwind classes
  const pageClass = darkMode
    ? "min-h-screen bg-gray-900 text-gray-100 p-6"
    : "min-h-screen bg-gray-100 text-gray-900 p-6";

  const cardClass = darkMode
    ? "bg-gray-800 shadow-lg rounded-lg p-6 backdrop-blur-sm"
    : "bg-white shadow-lg rounded-lg p-6";

  const inputClass = darkMode
    ? "border border-gray-600 p-2 rounded w-full bg-gray-700 text-gray-100"
    : "border p-2 rounded w-full";

  const buttonClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium px-4 py-2 rounded"
    : "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded";

  return (
    <div className={pageClass}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name || user?.email}
          </h2>
          <div className="flex gap-3">
            <button onClick={() => setDarkMode(prev => !prev)} className={buttonClass}>
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

        {/* Top summary */}
        <div className={cardClass}>
          <h3 className="text-2xl font-semibold mb-4">Summary</h3>
          <Balance groupId={null} darkMode={darkMode} />
        </div>

        {/* Grid: Groups + Friends + Add Expense */}
        <div className="grid lg:grid-cols-3 gap-6">
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
                groups.map(group => (
                  <li
                    key={group._id}
                    className="p-2 border rounded hover:bg-blue-50 flex justify-between items-center"
                  >
                    {/* Group Name */}
                    <Link
                      to={`/group/${group._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {group.name}
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => handledeleteGroup(group._id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete group"
                    >
                      <MdDelete size={20} />
                    </button>
                  </li>
                ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No groups yet.</p>
              )}
            </ul>

          </div>

          {/* Friends */}
          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-3">Your Friends</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter friend's email"
                value={emailToAdd}
                onChange={e => setEmailToAdd(e.target.value)}
                className={inputClass}
              />
              <button onClick={handleAddFriend} className={buttonClass}>Invite</button>
            </div>
            <ul className="space-y-1">
              {friends.length > 0 ? (
                friends.map(f => (
                  <li key={f._id}>
                    {f.name} ({f.email})
                  </li>
                ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No friends added yet.</p>
              )}
            </ul>
          </div>

          {/* Add Expense */}
          <div className={cardClass}>
            <h3 className="text-xl font-semibold mb-3">Add Expense</h3>
            <button
              onClick={() => setShowAddExpense(prev => !prev)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded mb-4"
            >
              {showAddExpense ? "Hide Expense Form" : "➕ Add Expense"}
            </button>
            {showAddExpense && (
              <div className={darkMode ? "bg-gray-700 p-4 border border-gray-600 rounded shadow-md" : "bg-white p-4 border rounded shadow-md"}>
                <AddExpense darkMode={darkMode} />
              </div>
            )}
          </div>
        </div>

        {/* Expenses Section */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Expenses</h3>
          </div>

          {/* Personal Expenses */}
          {expenses.personal.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Personal Expenses</h4>
              <ul className="space-y-3">
                {expenses.personal.map(exp => (
                  <li
                    key={exp._id}
                    className={`flex justify-between items-center p-4 border rounded shadow-sm ${
                      darkMode
                        ? "bg-gray-700 border-gray-700 hover:bg-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{exp.description}</p>
                      <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                        Paid by: {exp.paidBy == user.name ? "You" : exp.paidBy} | Split among: {exp.participants.map(p => p == user.name ? "You" : p).join(", ")} | Date: {exp.date.split("T")[0]}
                      </p>
                    </div>
                    <p className={darkMode ? "text-green-400 font-semibold" : "text-green-600 font-semibold"}>₹{exp.amount}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Group Expenses */}
          {expenses.group.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-2">Group Expenses</h4>
              {expenses.group.map(grp => (
                <div key={grp.groupId} className="mb-4">
                  <p className="font-semibold mb-2">{grp.groupName}</p>
                  <ul className="space-y-3">
                    {grp.expenses.map(exp => (
                      <li
                        key={exp._id}
                        className={`flex justify-between items-center p-4 border rounded shadow-sm ${
                          darkMode
                            ? "bg-gray-700 border-gray-700 hover:bg-gray-600 text-gray-100"
                            : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{exp.description}</p>
                          <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                            Paid by: {exp.paidBy == user.name ? "You" : exp.paidBy} | Split among: {exp.participants.map(p => p == user.name ? "You" : p).join(", ")} | Date: {exp.date.split("T")[0]}
                          </p>
                        </div>
                        <p className={darkMode ? "text-green-400 font-semibold" : "text-green-600 font-semibold"}>₹{exp.amount}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* No Expenses */}
          {expenses.personal.length === 0 && expenses.group.length === 0 && (
            <p className={darkMode ? "text-gray-400 mt-2" : "text-gray-500 mt-2"}>No expenses added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
