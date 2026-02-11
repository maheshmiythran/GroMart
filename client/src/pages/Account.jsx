import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Account = () => {
    const { user, axios, setUser, handleUserLogout, navigate } = useAppContext();
    const [activeSection, setActiveSection] = useState('profile');

    // Profile State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Addresses State (fetching same as EditAddress/Cart logic ideally, or just managing here)
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
            fetchAddresses();
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get('/api/address/get', { headers: { token: localStorage.getItem('token') } }); // Assuming auth middleware checks header/cookie
            // Note: The existing axios instance might handle token via cookies or interceptors. 
            // verified: authUser uses req.headers.token or req.cookies.token
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const { data } = await axios.put('/api/user/update-profile', { name, phone });
            if (data.success) {
                toast.success(data.message);
                setUser({ ...user, name, phone });
                setIsEditingProfile(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChangePassword = async () => {
        try {
            const { data } = await axios.put('/api/user/update-profile', { password: currentPassword, newPassword });
            if (data.success) {
                toast.success(data.message);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteAccount = () => {
        toast(
            (t) => (
                <div className="p-4 flex flex-col gap-2">
                    <p className="font-semibold text-red-600">Delete Account Permanently?</p>
                    <p className="text-sm">This action cannot be undone.</p>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                try {
                                    const { data } = await axios.delete('/api/user/delete-account');
                                    if (data.success) {
                                        toast.success(data.message);
                                        handleUserLogout();
                                    } else {
                                        toast.error(data.message);
                                    }
                                } catch (error) {
                                    toast.error(error.message);
                                }
                            }}
                        >
                            Confirm Delete
                        </button>
                        <button
                            className="bg-gray-200 px-3 py-1 rounded text-sm"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )
        );
    };

    const handleDeleteAddress = async (id) => {
        try {
            const { data } = await axios.delete(`/api/address/delete/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchAddresses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col md:flex-row gap-8 p-6 md:p-12 lg:px-24">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 flex flex-col gap-2">
                <button
                    onClick={() => setActiveSection('profile')}
                    className={`text-left px-4 py-3 rounded ${activeSection === 'profile' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Profile Information
                </button>
                <button
                    onClick={() => setActiveSection('password')}
                    className={`text-left px-4 py-3 rounded ${activeSection === 'password' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Change Password
                </button>
                <button
                    onClick={() => setActiveSection('address')}
                    className={`text-left px-4 py-3 rounded ${activeSection === 'address' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Manage Addresses
                </button>
                <button
                    onClick={() => setActiveSection('delete')}
                    className={`text-left px-4 py-3 rounded ${activeSection === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-red-600'}`}
                >
                    Delete Account
                </button>
            </div>

            {/* Content */}
            <div className="w-full md:w-3/4 bg-white p-6 rounded shadow-sm border border-gray-200">
                {activeSection === 'profile' && (
                    <div className="max-w-md">
                        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditingProfile}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={!isEditingProfile}
                                    placeholder="Add mobile number"
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-50"
                                />
                            </div>

                            {isEditingProfile ? (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingProfile(false);
                                            setName(user.name);
                                            setPhone(user.phone || '');
                                        }}
                                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600 mt-4"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'password' && (
                    <div className="max-w-md">
                        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                    autoComplete="current-password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                    autoComplete="new-password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600 mt-4"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                )}

                {activeSection === 'address' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Saved Addresses</h2>
                            <button
                                onClick={() => navigate('/add-address')}
                                className="text-primary hover:text-green-700 font-medium flex items-center gap-1"
                            >
                                + Add New Address
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <div key={addr._id} className="border border-gray-200 rounded p-4 relative">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/edit-address/${addr._id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                    <h3 className="font-semibold">{addr.firstName} {addr.lastName}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{addr.street}, {addr.city}</p>
                                    <p className="text-gray-600 text-sm">{addr.state}, {addr.zipcode}</p>
                                    <p className="text-gray-600 text-sm">{addr.country}</p>
                                    <p className="text-gray-600 text-sm mt-1">Phone: {addr.phone}</p>
                                </div>
                            ))}
                            {addresses.length === 0 && (
                                <p className="text-gray-500">No addresses found.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'delete' && (
                    <div className="max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete your account? This will permanently erase all your data, order history, and saved addresses.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        >
                            Delete My Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
