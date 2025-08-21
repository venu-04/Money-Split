import axios from "axios";
import { useEffect, useState } from "react";

const AddExpense = ({ group = null, groupmembers = [], darkMode = false }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (group) {
          setFriends(groupmembers);
          setSelectedFriends(groupmembers.map(member => member._id));
        } else {
          const res = await axios.get("http://localhost:5000/api/users/friends", {
            headers: { Authorization: token }
          });
          setFriends(res.data);
          setSelectedFriends([]);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
        alert("Failed to load friends. Please try again later.");
      }
    };
    fetchFriends();
  }, [group, groupmembers, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/expense/add-expense",
        {
          group,
          description,
          amount,
          participants: selectedFriends,
        },
        { headers: { Authorization: token } }
      );
      alert("Expense added successfully");
      setDescription("");
      setAmount("");
      if (!group) setSelectedFriends([]);
      console.log("Expense added:", res.data);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Please try again later.");
    }
  };

  const containerClass = darkMode
    ? "mt-6 bg-gray-800 text-gray-100 p-4 rounded shadow-md"
    : "mt-6 bg-white text-gray-800 p-4 rounded shadow-md";

  const inputClass = darkMode
    ? "border p-2 w-full rounded bg-gray-700 text-gray-100"
    : "border p-2 w-full rounded";

  const buttonClass = darkMode
    ? "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
    : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded";

  return (
    <div className={containerClass}>
      <h3 className="text-xl font-semibold mb-2">Add Expense:</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
          required
        />

        {!group && (
          <div>
            <label className="block mb-1">Select Friends:</label>
            <select
              multiple
              value={selectedFriends}
              onChange={(e) =>
                setSelectedFriends(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
              className={inputClass}
            >
              {friends.map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.name || friend.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className={buttonClass}>
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
