import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AddExpense from "./AddExpense";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [emailToAdd, setEmailToAdd] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/group/my-groups", {
          headers: { Authorization: token }
        });
        setGroups(res.data.groups);
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };

    const fetchFriends = async () => {
      const res = await axios.get("http://localhost:5000/api/users/friends", {
        headers: { Authorization: token }
      });
      setFriends(res.data);
    };

    fetchDashboardData();
    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/add-friend",
        { email: emailToAdd },
        { headers: { Authorization: token } }
      );
      alert(res.data.message);
      setEmailToAdd("");
      const updatedFriends = await axios.get("http://localhost:5000/api/users/friends", {
        headers: { Authorization: token }
      });
      setFriends(updatedFriends.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 👤 User Info */}
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || user?.email}</h2>

      {/* ➕ Create Group Button */}
      <Link to="/create-group" className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-6">
        ➕ Create New Group
      </Link>

      {/* 👥 My Groups */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold">Your Groups:</h3>
        <ul className="mt-2 space-y-2">
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group._id} className="p-3 border rounded shadow-sm">
                <Link to={`/group/${group._id}`} className="text-blue-600 hover:underline">
                {group.name}
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500 mt-2">No groups yet.</p>
          )}
        </ul>
      </div>

     <button>
      <Link to={"/add-expense"} className="bg-green-600 text-white px-4 py-2 rounded inline-block mb-6">
              Add Expense
      </Link>
          
     </button>

      {/* 👯 Add Friend by Email */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add Friend by Email:</h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter friend's email"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleAddFriend} className="bg-green-600 text-white px-4 py-2 rounded">
            Invite
          </button>
        </div>

        {/* Friend List */}
        <div className="mt-4">
          <h4 className="text-lg font-medium">Your Friends:</h4>
          <ul className="mt-2 space-y-1">
            {friends.length > 0 ? (
              friends.map((f) => (
                <li key={f._id}>{f.name} ({f.email})</li>
              ))
            ) : (
              <p className="text-gray-500">No friends added yet.</p>
            )}
          </ul>
        </div>
      </div>

      {/* 📊 Balances (Future) */}
      <div>
        <h3 className="text-xl font-semibold">Your Balances:</h3>
        <p className="text-gray-500 mt-2">This section will show how much you owe or are owed — coming soon!</p>
      </div>
    </div>
  );
}
