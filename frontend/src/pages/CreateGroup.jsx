import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const CreateGroup = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
   const [selectedMembers, setSelectedMembers] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFriends = async () => {
            try{
                const res=await axios.get('http://localhost:5000/api/users/friends', {
                    headers:{
                        Authorization: token
                    }
                });
                setUsers(res.data);
            }
            catch(error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchFriends();
    }, []);

    const handlesubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/api/group/create',
                {
                    name: groupName,
                    members: selectedMembers
                },
                {
                    headers:{
                        Authorization: token
                    }
                }
            );
            alert('Group created successfully!');
            setGroupName('');
            setSelectedMembers([]);
            navigate('/dashboard'); // Redirect to Dashboard after creating group
        }
        catch(err){
            alert(err.response?.data?.message || "Error creating group");
        }

    };

    const toggleMember = (userId) => {
    if(selectedMembers.includes(userId)) {
        setSelectedMembers(selectedMembers.filter((id) => id!==userId));
    }
    else{
        setSelectedMembers([...selectedMembers,userId]);
    }
    };



    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
               <h2 className="text-2xl font-semibold mb-4">Create Group</h2>
               <form onSubmit={handlesubmit} className='space-y-4'>
                <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder='Group Name'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                />
                <div>
                    <h3 className="text-lg font-medium mb-2">Select Friends:</h3>
                    <div className="max-h-40 overflow-y-auto border p-2 rounded">
                        {users.map((user) => (
                            <div key={user._id}>
                                <label className="flex items-center space-x-2">
                                    <input
                                     type="checkbox"
                                     checked={selectedMembers.includes(user._id)}
                                     onChange={() => toggleMember(user._id)}
                                     />
                                     <span>{user.name} ({user.email})</span>
                                </label>

                            </div>
                        ))}

                    </div>
                </div>
                <button  type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Group

                </button>
                

               </form>
               
        </div>
    );

}
export default CreateGroup;