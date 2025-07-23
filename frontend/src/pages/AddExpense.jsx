import axios from "axios";
import { useEffect, useState } from "react"


const  AddExpense = ({group = null,groupmembers = []}) =>  {
const [description, setDescription] = useState("");
const [amount,setAmount] = useState("");
const [friends, setFriends] = useState([]);
const [selectedFriends, setSelectedFriends] = useState([]);

const token = localStorage.getItem('token');

useEffect(() => {
    const fetchFriends = async() => {
        try {
           let res;
            if(group){
                 res= await axios.get(`http://localhost:5000/api/group/${group}`, {
                        headers:{Authorization:token}
                    });
                setFriends(groupmembers);
                setSelectedFriends(groupmembers.map(member => member._id));
            
            }else{
                     res= await axios.get("http://localhost:5000/api/users/friends", {
                        headers:{Authorization:token}
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
},[group,groupmembers, token]);
const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:5000/api/expense/add-expense", {
            group, // Assuming you want to add expense without a specific group for now
            description,
            amount,
            participants: selectedFriends,   // An array of user IDs (extracted from selectedFriends) who are involved in this expense.
         }, { headers: {Authorization: token},}

        );
        alert("Expense added successfully");
        setDescription("");
        setAmount("");
        if(!group) setSelectedFriends([]); // Reset selected friends if not in a group
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

            {!group && (
            <div>
                <label> Select Friends:</label>
                <select 
                multiple
                value={selectedFriends} //shows selected options
                onChange = {e => {
                    const selected = Array.from(e.target.selectedOptions).map(option => 
                        option.value
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
            )}
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




// option-2
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function AddExpense({ group }) {
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const token = localStorage.getItem("token");

//   // Fetch participants if group is provided
//   useEffect(() => {
//     const fetchData = async () => {
//       if (group) {
//         try {
//           const res = await axios.get(`http://localhost:5000/api/group/${group}`, {
//             headers: { Authorization: token }
//           });
//           const groupMembers = res.data.members.map(member => member._id);
//           setParticipants(groupMembers);
//         } catch (err) {
//           console.error("Failed to fetch group members", err);
//         }
//       } else {
//         // Fetch all users if not inside group
//         try {
//           const res = await axios.get("http://localhost:5000/api/users/friends", {
//             headers: { Authorization: token }
//           });
//           setAllUsers(res.data);
//         } catch (err) {
//           console.error("Failed to fetch users", err);
//         }
//       }
//     };

//     fetchData();
//   }, [group, token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/expense/add-expense", {
//         description,
//         amount,
//         participants,
//         group: group || null,
//       }, {
//         headers: { Authorization: token }
//       });
//       alert("Expense added successfully");
//       setDescription("");
//       setAmount("");
//       if (!group) setParticipants([]);
//     } catch (error) {
//       console.error("Failed to add expense:", error);
//       alert("Error adding expense");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
//       <div className="mb-2">
//         <label className="block mb-1 font-semibold">Description</label>
//         <input
//           value={description}
//           onChange={e => setDescription(e.target.value)}
//           className="w-full border rounded px-2 py-1"
//           required
//         />
//       </div>

//       <div className="mb-2">
//         <label className="block mb-1 font-semibold">Amount</label>
//         <input
//           type="number"
//           value={amount}
//           onChange={e => setAmount(e.target.value)}
//           className="w-full border rounded px-2 py-1"
//           required
//         />
//       </div>

//       {/* Only show participant selector if not in group */}
//       {!group && (
//         <div className="mb-2">
//           <label className="block mb-1 font-semibold">Participants</label>
//           <select
//             multiple
//             value={participants}
//             onChange={e =>
//               setParticipants(Array.from(e.target.selectedOptions, opt => opt.value))
//             }
//             className="w-full border rounded px-2 py-1"
//           >
//             {allUsers.map(user => (
//               <option key={user._id} value={user._id}>
//                 {user.name} ({user.email})
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       <button
//         type="submit"
//         className="bg-green-600 text-white px-4 py-2 rounded mt-2"
//       >
//         Add Expense
//       </button>
//     </form>
//   );
// }
