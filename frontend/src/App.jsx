import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GroupDetails from './pages/GroupDetails.jsx';
import AddExpense from './pages/AddExpense.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-expense" element={<AddExpense />}/>
        <Route path="/group/:id" element={<GroupDetails />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Register />} /> {/* Default to Register */}
      </Routes>
    </Router>
  );
}

export default App;
