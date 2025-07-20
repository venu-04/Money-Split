import axios from "axios";
import { useEffect, useState } from "react"


const  AddExpense = () =>  {
const [description, setDescription] = useState("");
const [amount,setAmount] = useState("");
const [friends, setFriends] = useState([]);
const [selectedFriends, setSelectedFriends] = useState([]);

const token = localStorage.getItem('token');

useEffect(() => {
    const fetchFriends = async() => {
        try {
            const res= await axios.get("http://localhost:5000/api/users/friends", {
            headers:{Authorization:token}
        });
        setFriends(res.data);
        } catch (error) {
            console.error("Failed to fetch friends:", error);
            alert("Failed to load friends. Please try again later.");
            
        }
        
    };
    fetchFriends();
},[]);
const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:5000/api/expense/add-expense", {
         
            description,
            amount,
            participants: selectedFriends.map(friend => friend._id),    // An array of user IDs (extracted from selectedFriends) who are involved in this expense.
         }, { headers: {Authorization: token},}

        );
        alert("Expense added successfully");
        setDescription("");
        setAmount("");
        setSelectedFriends([]);
        console.log("Expense added:", res.data);
    } catch (error) {
        console.error("Failed to add expense:", error);
        alert("Failed to add expense. Please try again later.");
        
    }
}

  return (
    <div className="mt-6">
        <h3 className="text-xl font-semibold"> Add Expense:</h3>
        <form onSubmit={handleSubmit} className="mt-2 space-y-3">
            <input
             type="text"
             placeholder="Description"
             value={description}
             onChange={(e) => {setDescription(e.target.value)}} 
             className="border p-2 w-full rounded"
             required
             />

            <input 
             type="number"
             placeholder="Amount"
             value={amount}
             onChange={e => setAmount(e.target.value)}
             className="border p-2 w-full rounded"
             required
            />

            <div>
                <label> Select Friends:</label>
                <select 
                multiple
                value={selectedFriends.map(friend => friend._id)} //shows selected options
                onChange = {e => {
                    const selected = [...e.target.selectedOptions].map(option => 
                        friends.find(f => f._id === option.value)
                    );
                    setSelectedFriends(selected);
                }}
                className="border p-2 w-full rounded"
                >
                    {friends.map(friend => (
                        <option key ={friend._id} value={friend._id}>
                            {friend.name || friend.email}

                        </option>
                        
                    ))}
                 </select>

            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded "
                >
                Add Expense
            </button>
              

        </form>
      
    </div>
  );
};

export default AddExpense
