import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGroupData = async () => {
      try {
        const [groupRes, expensesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/group/${id}`, {
            headers: { Authorization: token },
          }),
          axios.get(`http://localhost:5000/api/expense/${id}/expenses`, {
            headers: { Authorization: token },
          }),
        ]);

        setGroup(groupRes.data);
        setExpenses(expensesRes.data || []);
      } catch (error) {
        alert("Failed to load group data");
        console.error(error);
        navigate("/dashboard");
      }
    };

    fetchGroupData();
  }, [id, token, navigate]);

  if (!group) return <p className="p-6 text-gray-600">Loading...</p>;

  // Helper classes for dark/light mode
  const pageClass = darkMode
    ? "min-h-screen bg-gray-900 text-gray-100 p-6"
    : "min-h-screen bg-gradient-to-r from-blue-50 via-white to-green-50 text-gray-900 p-6";

  const cardClass = darkMode
    ? "bg-gray-800 shadow rounded p-6 backdrop-blur-sm"
    : "bg-white/90 shadow rounded p-6 backdrop-blur-sm";

  const memberItemClass = darkMode
    ? "p-3 border border-gray-700 rounded shadow-sm hover:bg-gray-700"
    : "p-3 border border-gray-200 rounded shadow-sm hover:bg-blue-50";

  const expenseItemClass = darkMode
    ? "p-4 border border-gray-700 rounded shadow-sm flex justify-between items-center bg-gray-700 hover:bg-gray-600"
    : "p-4 border border-gray-200 rounded shadow-sm flex justify-between items-center bg-gray-50 hover:bg-gray-100";

  const expenseAmountClass = darkMode ? "text-green-400 font-semibold" : "text-green-600 font-semibold";

  return (
    <div className={pageClass}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className={darkMode
              ? "bg-gray-700 text-gray-100 px-4 py-2 rounded hover:bg-gray-600"
              : "bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300"}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Group Header */}
        <div className={cardClass}>
          <h2 className="text-3xl font-bold mb-2">{group.name}</h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Group ID: {group._id}</p>
        </div>

        {/* Members Section */}
        <div className={cardClass}>
          <h3 className="text-2xl font-semibold mb-3">Members</h3>
          <ul className="space-y-2">
            {group.members.map((member) => (
              <li key={member._id} className={memberItemClass}>
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        </div>

        {/* Expenses Section */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Expenses</h3>
            <button
              onClick={() => setShowAddExpense(prev => !prev)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
            >
              {showAddExpense ? "Hide Expense Form" : "➕ Add Expense"}
            </button>
          </div>

          {showAddExpense && (
            <div className={darkMode ? "bg-gray-700 p-4 border border-gray-600 rounded shadow-md mb-4" : "bg-white p-4 border rounded shadow-md mb-4"}>
              <AddExpense group={id} groupmembers={group.members} darkMode={darkMode}/>
            </div>
          )}

          {/* List of Expenses */}
          {expenses.length > 0 ? (
            <ul className="space-y-3">
              {expenses.map((exp) => (
                <li key={exp._id} className={expenseItemClass}>
                  <div>
                    <p className="font-semibold">{exp.description}</p>
                    <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
                      Paid by: {exp.paidBy.name} | Split among: {exp.participants.map(u => u.name).join(", ")}
                    </p>
                  </div>
                  <p className={expenseAmountClass}>₹{exp.amount}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={darkMode ? "text-gray-400 mt-2" : "text-gray-500 mt-2"}>No expenses added yet for this group.</p>
          )}
        </div>
      </div>
    </div>
  );
}
