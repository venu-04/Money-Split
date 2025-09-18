import React, { useState } from 'react';
import axios from 'axios';

// function Register() {
const Register = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');

    const { name, email, password, confirmpassword } = formData;

    if (!name || !email || !password || !confirmpassword) {
      return setMessage('All fields are required');
    }

    if (password !== confirmpassword) {
      return setMessage('Passwords do not match');
    }

    try {
      setIsSubmitting(true);

      // const res = await axios.post('http://localhost:5000/api/auth/register', {
      const res = await axios.post('https://money-split.onrender.com/api/auth/register', {
        name:formData.name,
        email:formData.email,
        password:formData.password,
        confirmpassword:formData.confirmpassword
      });

      if (res.status === 200 || res.status === 201) {
        setMessage('✅ Registered successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmpassword: ''
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {

        //The backend sends message in the response to display to the user in the following format to the frontend
        //       Example:
        //       if the user already exists, the backend sends the following response 
        //        {
        //           response: {
        //                       data: {
        //                               message: "User already exists"
        //                             }
        //                     }
        //        }

        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Server error. Try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

        {message && (
          <div className="mb-4 text-center text-sm text-red-600">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.confirmpassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
