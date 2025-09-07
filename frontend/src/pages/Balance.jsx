import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Balance({ darkMode = false }) {
  const [youOwe, setYouOwe] = useState([]);
  const [youAreOwed, setYouAreOwed] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [settleAmount, setSettleAmount] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Get user info from token
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.name?.trim() || "");
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token", err);
      setError("Invalid token, please login again");
      setLoading(false);
    }
  }, [token, navigate]);

  // Fetch balances when username is ready
  useEffect(() => {
    if (username) fetchBalances();
  }, [username]);

  const fetchBalances = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/balance", {
      headers: { Authorization: token },
    });

    const rawIds = res.data.netBalance || {};   // keyed by IDs
    const rawNames = res.data.withNames || {};  // same keys, but with names

    let oweArr = [];
    let owedArr = [];
    let total = 0;
Object.entries(rawIds).forEach(([idKey, value]) => {
  const [fromId, toId] = idKey.split(" -> ").map(s => s.trim());

  // Find corresponding name pair in withNames
  const nameEntry = Object.entries(rawNames).find(([nameKey, amount]) => {
    const [fromName, toName] = nameKey.split(" -> ").map(s => s.trim());
    // Match the amount as a fallback (since keys are different)
    return amount === value;
  });

  const [fromName, toName] = nameEntry
    ? nameEntry[0].split(" -> ").map(s => s.trim())
    : [fromId, toId]; // fallback to IDs if not found

  if (fromId === userId) {
    oweArr.push({ toId, toName, amount: value });
    total -= value;
  } else if (toId === userId) {
    owedArr.push({ fromId, fromName, amount: value });
    total += value;
  }
});



    setYouOwe(oweArr);
    setYouAreOwed(owedArr);
    setTotalBalance(total);
  } catch (err) {
    console.error(err);
    setError("Failed to load balances");
  }
  setLoading(false);
};


  const handleSettle = async (personId, amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount to settle.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/expense/settle",
        {
          to: personId, // backend expects ObjectId
          amount: Math.abs(amount),
        },
        { headers: { Authorization: token } }
      );

      fetchBalances(); // refresh balances
      setSettleAmount({ ...settleAmount, [personId]: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to settle up");
    }
  };

  const containerClass = darkMode
    ? "max-w-md mx-auto p-4 bg-gray-800 text-gray-100 shadow-md rounded"
    : "max-w-md mx-auto p-4 bg-white text-gray-800 shadow-md rounded";

  const titleClass = "text-xl font-bold mb-4";
  const sectionTitleClass = "font-semibold mb-2";
  const textClass = darkMode ? "text-gray-200" : "text-gray-500";

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={titleClass}>
          💰 Total Balance:{" "}
          <span className={totalBalance >= 0 ? "text-green-500" : "text-red-500"}>
            ₹{totalBalance.toFixed(2)}
          </span>
        </h3>
      </div>

      {loading && <p className={textClass}>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4">
            <h4 className={sectionTitleClass}>➡️ You Owe:</h4>
            {youOwe.length > 0 ? (
              <ul className="space-y-3">
                {youOwe.map(({ toId, toName, amount }) => (
                  <li key={toId} className="flex justify-between items-center text-red-600">
                    <span>You owe {toName}: ₹{amount.toFixed(2)}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={settleAmount[toId] || ""}
                        onChange={(e) =>
                          setSettleAmount({ ...settleAmount, [toId]: e.target.value })
                        }
                        className="w-20 p-1 border rounded"
                      />
                      <button
                        onClick={() =>
                          handleSettle(toId, settleAmount[toId] || amount)
                        }
                        className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Settle
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={textClass}>You don’t owe anyone 🎉</p>
            )}
          </div>

          <div>
            <h4 className={sectionTitleClass}>⬅️ You Are Owed:</h4>
            {youAreOwed.length > 0 ? (
              <ul className="list-disc pl-5">
                {youAreOwed.map(({ fromId, fromName, amount }) => (
                  <li key={fromId} className="text-green-600">
                    {fromName} owes you: ₹{amount.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={textClass}>No one owes you yet 🙂</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}



// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Balance({ darkMode = false }) {
//   const [balances, setBalances] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/balance", {
//           headers: { Authorization: token },
//         });
//         setBalances(res.data.netBalance || {});       // Store the fetched balances
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load balances");
//       }
//       setLoading(false);  //// Done loading
//     };

//     fetchBalances();
//   }, [token]);


//     // Separate you owe vs you are owed
//   //Object.entries(balances) converts object into array of key-value pairs:
//   const youOwe = Object.entries(balances).filter(([_, amount]) => amount < 0);
//   const youAreOwed = Object.entries(balances).filter(([_, amount]) => amount > 0);

//   // Total balance calculation
// //   reduce sums them
//   const totalBalance = Object.values(balances).reduce((acc, val) => acc + val, 0);

//   // Dynamic classes based on dark mode
//   const containerClass = darkMode
//     ? "max-w-md mx-auto p-4 bg-gray-800 text-gray-100 shadow-md rounded"
//     : "max-w-md mx-auto p-4 bg-white text-gray-800 shadow-md rounded";

//   const titleClass = "text-xl font-bold mb-4";
//   const sectionTitleClass = "font-semibold mb-2";
//   const textClass = darkMode ? "text-gray-200" : "text-gray-500";

//   return (
//     <div className={containerClass}>
//       <h3 className={titleClass}>💰 Total Balance: ₹{totalBalance}</h3>

//       {loading && <p className={textClass}>Loading...</p>}   {/* // if loading is true it will show Loading...  */}
//       {error && <p className="text-red-500">{error}</p>}   {/* // if there  is an error it will show error  */}

//       {!loading && !error && (
//         <>
//           <div className="mb-4">
//             <h4 className={sectionTitleClass}>➡️ You Owe:</h4>
//             {youOwe.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {youOwe.map(([user, amount]) => (
//                   <li key={user}>
//                     {user}: ₹{Math.abs(amount)}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className={textClass}>You don’t owe anyone 🎉</p>
//             )}
//           </div>

//           <div>
//             <h4 className={sectionTitleClass}>⬅️ You Are Owed:</h4>
//             {youAreOwed.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {youAreOwed.map(([user, amount]) => (
//                   <li key={user}>
//                     {user}: ₹{amount}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className={textClass}>No one owes you yet 🙂</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }