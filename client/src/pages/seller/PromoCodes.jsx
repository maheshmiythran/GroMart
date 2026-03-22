import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const PromoCodes = () => {
    const { axios, currency } = useAppContext();
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        type: 'percent',
        value: '',
        maxDiscount: '',
        minOrderValue: 0,
        usageLimit: '',
        perUserLimit: 1,
        expiryDate: '',
    });

    const fetchPromoCodes = async () => {
        try {
            const { data } = await axios.get('/api/promocode/list');
            if (data.success) {
                setPromoCodes(data.promoCodes);
            }
        } catch (error) {
            toast.error('Failed to fetch promo codes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.usageLimit) delete payload.usageLimit;
            if (!payload.maxDiscount) delete payload.maxDiscount;

            const { data } = await axios.post('/api/promocode/create', payload);

            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                setFormData({
                    code: '', type: 'percent', value: '', maxDiscount: '', minOrderValue: 0, usageLimit: '', perUserLimit: 1, expiryDate: ''
                });
                fetchPromoCodes();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this promo code?")) return;
        try {
            const { data } = await axios.post('/api/promocode/delete', { id });
            if (data.success) {
                toast.success(data.message);
                fetchPromoCodes();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleStatus = async (promo) => {
        const newStatus = promo.status === 'active' ? 'inactive' : 'active';
        try {
            const { data } = await axios.post('/api/promocode/update', { id: promo._id, status: newStatus });
            if (data.success) {
                toast.success('Status updated');
                fetchPromoCodes();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col">
            <div className="w-full md:p-10 p-4">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-medium">Promo Codes</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition"
                    >
                        Create New Valid Code
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
                        <table className="table-auto w-full text-left min-w-[700px]">
                            <thead className="bg-gray-50 text-gray-900 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold">Code</th>
                                    <th className="px-4 py-3 text-sm font-semibold">Discount</th>
                                    <th className="px-4 py-3 text-sm font-semibold">Usage</th>
                                    <th className="px-4 py-3 text-sm font-semibold">Expiry</th>
                                    <th className="px-4 py-3 text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {promoCodes.map((promo) => (
                                    <tr key={promo._id} className="text-sm text-gray-700">
                                        <td className="px-4 py-3 font-medium text-gray-900">{promo.code}</td>
                                        <td className="px-4 py-3">
                                            {promo.type === 'flat' ? `${currency}${promo.value}` : `${promo.value}%`}
                                            {promo.type === 'percent' && promo.maxDiscount && ` (Max ${currency}${promo.maxDiscount})`}
                                        </td>
                                        <td className="px-4 py-3">
                                            {promo.usedCount} / {promo.usageLimit || '∞'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(promo.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleStatus(promo)}
                                                className={`px-2 py-1 text-xs rounded-full ${promo.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    promo.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}
                                                disabled={promo.status === 'expired'}
                                            >
                                                {promo.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDelete(promo._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {promoCodes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">No promo codes found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Create Promo Code</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Code Name</label>
                                <input
                                    type="text" name="code" value={formData.code} onChange={handleInputChange}
                                    required className="w-full border p-2 rounded focus:ring-primary focus:border-primary uppercase"
                                    placeholder="e.g. SUMMER50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        name="type" value={formData.type} onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                    >
                                        <option value="percent">Percentage</option>
                                        <option value="flat">Flat Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                    <input
                                        type="number" name="value" value={formData.value} onChange={handleInputChange}
                                        required min="1" className="w-full border p-2 rounded"
                                    />
                                </div>
                            </div>

                            {formData.type === 'percent' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Cap ({currency}) - Optional</label>
                                    <input
                                        type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleInputChange}
                                        min="1" className="w-full border p-2 rounded"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order ({currency})</label>
                                    <input
                                        type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleInputChange}
                                        min="0" className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Limit - Opt</label>
                                    <input
                                        type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange}
                                        min="1" className="w-full border p-2 rounded" placeholder="Unlmited"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                                    <input
                                        type="number" name="perUserLimit" value={formData.perUserLimit} onChange={handleInputChange}
                                        min="1" required className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange}
                                        required className="w-full border p-2 rounded"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save Code</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCodes;
