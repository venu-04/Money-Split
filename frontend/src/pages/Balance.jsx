

// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Balance() {
//   const [balances, setBalances] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   // Fetch balances on mount
//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/balance", {
//           headers: { Authorization: token },
//         });
//         setBalances(res.data.netBalance || {});   // Store the fetched balances
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load balances");
//       }
//       setLoading(false);  //// Done loading
//     };

//     fetchBalances();
//   }, [token]);

//   // Separate you owe vs you are owed
//   //Object.entries(balances) converts object into array of key-value pairs:
//   const youOwe = Object.entries(balances).filter(([_, amount]) => amount < 0);
//   const youAreOwed = Object.entries(balances).filter(([_, amount]) => amount > 0);

//   // Total balance calculation
// //   reduce sums them
//   const totalBalance = Object.values(balances).reduce((acc, val) => acc + val, 0);

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
//       <h3 className="text-xl font-bold mb-4">💰 Total Balance: ₹{totalBalance}</h3>

//        {loading && <p className="text-gray-500">Loading...</p>}  {/* // if loading is true it will show Loading...  */}
//       {error && <p className="text-red-500">{error}</p>}     {/* // if there  is an error it will show error  */}

//       {!loading && !error && (
//         <>
//           <div className="mb-4">
//             <h4 className="font-semibold">➡️ You Owe:</h4>
//             {youOwe.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {youOwe.map(([user, amount]) => (
//                   <li key={user}>
//                     {user}: ₹{Math.abs(amount)}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">You don’t owe anyone 🎉</p>
//             )}
//           </div>

//           <div>
//             <h4 className="font-semibold">⬅️ You Are Owed:</h4>
//             {youAreOwed.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {youAreOwed.map(([user, amount]) => (
//                   <li key={user}>
//                     {user}: ₹{amount}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No one owes you yet 🙂</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";

export default function Balance({ darkMode = false }) {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/balance", {
          headers: { Authorization: token },
        });
        setBalances(res.data.netBalance || {});       // Store the fetched balances
      } catch (err) {
        console.error(err);
        setError("Failed to load balances");
      }
      setLoading(false);  //// Done loading
    };

    fetchBalances();
  }, [token]);


    // Separate you owe vs you are owed
  //Object.entries(balances) converts object into array of key-value pairs:
  const youOwe = Object.entries(balances).filter(([_, amount]) => amount < 0);
  const youAreOwed = Object.entries(balances).filter(([_, amount]) => amount > 0);

  // Total balance calculation
//   reduce sums them
  const totalBalance = Object.values(balances).reduce((acc, val) => acc + val, 0);

  // Dynamic classes based on dark mode
  const containerClass = darkMode
    ? "max-w-md mx-auto p-4 bg-gray-800 text-gray-100 shadow-md rounded"
    : "max-w-md mx-auto p-4 bg-white text-gray-800 shadow-md rounded";

  const titleClass = "text-xl font-bold mb-4";
  const sectionTitleClass = "font-semibold mb-2";
  const textClass = darkMode ? "text-gray-200" : "text-gray-500";

  return (
    <div className={containerClass}>
      <h3 className={titleClass}>💰 Total Balance: ₹{totalBalance}</h3>

      {loading && <p className={textClass}>Loading...</p>}   {/* // if loading is true it will show Loading...  */}
      {error && <p className="text-red-500">{error}</p>}   {/* // if there  is an error it will show error  */}

      {!loading && !error && (
        <>
          <div className="mb-4">
            <h4 className={sectionTitleClass}>➡️ You Owe:</h4>
            {youOwe.length > 0 ? (
              <ul className="list-disc pl-5">
                {youOwe.map(([user, amount]) => (
                  <li key={user}>
                    {user}: ₹{Math.abs(amount)}
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
                {youAreOwed.map(([user, amount]) => (
                  <li key={user}>
                    {user}: ₹{amount}
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
