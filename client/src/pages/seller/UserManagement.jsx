import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const { axios, currency } = useAppContext();
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/user/all-users', {
                withCredentials: true
            });
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingId(user._id);
        setUpdatedName(user.name);
        setUpdatedEmail(user.email);
    };

    const handleUpdateUser = async (id) => {
        try {
            const { data } = await axios.post('/api/user/update', {
                id,
                name: updatedName,
                email: updatedEmail
            }, { withCredentials: true });

            if (data.success) {
                toast.success(data.message);
                setEditingId(null);
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (userId) => {
        toast(
            (t) => (
                <div className="p-4 w-full max-w-xs sm:max-w-sm text-center">
                    <p className="text-base font-semibold text-gray-800">
                        Confirm Deletion
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Are you sure you want to delete this user?
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                try {
                                    const { data } = await axios.post('/api/user/delete', { id: userId }, { withCredentials: true });
                                    if (data.success) {
                                        toast.success(data.message);
                                        fetchUsers();
                                    } else {
                                        toast.error(data.message);
                                    }
                                } catch (error) {
                                    toast.error(error.message);
                                }
                            }}
                        >
                            Yes, Delete
                        </button>
                        <button
                            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: 10000 }
        );
    };

    return (
        <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">User Management</h2>
                <div className="flex flex-col items-center max-w-7xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Name</th>
                                <th className="px-4 py-3 font-semibold truncate">Email</th>
                                <th className="px-4 py-3 font-semibold truncate">Cart Items</th>
                                <th className="px-4 py-3 font-semibold truncate">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-3 text-center">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-t border-gray-500/20 hover:bg-gray-50">
                                        <td className="px-4 py-3 truncate">
                                            {editingId === user._id ? (
                                                <input
                                                    type="text"
                                                    value={updatedName}
                                                    onChange={(e) => setUpdatedName(e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                />
                                            ) : (
                                                user.name
                                            )}
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            {editingId === user._id ? (
                                                <input
                                                    type="email"
                                                    value={updatedEmail}
                                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            {user.cartItems ? Object.keys(user.cartItems).length : 0}
                                        </td>
                                        <td className="px-4 py-3 truncate">
                                            {editingId === user._id ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateUser(user._id)} className="text-green-600 hover:text-green-800">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditClick(user)} className="text-green-600 hover:text-green-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
