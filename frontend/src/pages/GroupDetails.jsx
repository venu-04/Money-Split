import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";

export default function GroupDetails() {
  const { id } = useParams(); // group ID from URL
  // console.log("groupid:", groupid);
  
  const [group, setGroup] = useState(null);
  const token = localStorage.getItem("token");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
        navigate("/login");
        return;
    }

    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/group/${id}`, {
          headers: { Authorization: token }
        });
        setGroup(res.data);
      } catch (error) {
        alert("Failed to load group");
        console.error(error);
        navigate("/dashboard");
      }
    };

    fetchGroup();
  }, [id,token, navigate]);

  if (!group) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>

      <h3 className="text-xl font-semibold mb-2">Members:</h3>
      <ul className="mb-4 space-y-1">
        {group.members.map((member) => (
          <li key={member._id}>
            {member.name} ({member.email})
          </li>
        ))}
      </ul>

          {/* <Link to={"/add-expense"}>
          <button className="bg-green-500 text-white px-3 py-1 rounded">Add Expense</button>
           </Link> */}

      

      <div className="mb-6">
          <button
            onClick={() => setShowAddExpense(prev => !prev)}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            {showAddExpense ? "Hide Expense Form" : "➕ Add Expense"}
          </button>

          {showAddExpense && (
            <div className="bg-white p-4 border rounded shadow-md">
              <AddExpense group={id} groupmembers={group.members}/>
            </div>
          )}
        </div>


      {/* Future Feature: Show Expenses Here */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Expenses:</h3>
        <p className="text-gray-500">This section will show expenses for this group.</p>
      </div>
    </div>
  );
}
