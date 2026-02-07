import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext()
  const [editingId, setEditingId] = React.useState(null);
  const [updatedPrice, setUpdatedPrice] = React.useState('');

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setUpdatedPrice(product.offerPrice);
  };

  const handleUpdatePrice = async (id) => {
    try {
      const { data } = await axios.post('/api/product/update', {
        id,
        updatedData: { offerPrice: updatedPrice }
      });
      if (data.success) {
        toast.success(data.message);
        setEditingId(null);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message) // Refresh the product list after toggling stock
      } else {
        toast.success(data.message || 'Failed to toggle stock');
      }
    }
    catch (error) {
      toast.error(data.message)
    }
  };

  const handleDelete = (productId) => {
    toast(
      (t) => (
        <div className="p-4 w-full max-w-xs sm:max-w-sm text-center">
          <p className="text-base font-semibold text-gray-800">
            Confirm Deletion
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete this product?
          </p>

          <div className="mt-4 flex justify-center gap-4">
            <button
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const { data } = await axios.delete(`/api/product/delete/${productId}`);
                  if (data.success) {
                    toast.success(data.message || "Product deleted");
                    fetchProducts();
                  } else {
                    toast.error(data.message || "Failed to delete product");
                  }
                } catch (error) {
                  toast.error(error.message || "Something went wrong");
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
      {
        duration: 10000,
        style: { maxWidth: '100%', width: 'auto' },
      }
    );
  };


  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                <th className="px-4 py-3 font-semibold truncate">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <img src={product.image[0]} alt="Product" className="w-16" />
                    </div>
                    <span className="truncate max-sm:hidden w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {editingId === product._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={updatedPrice}
                          onChange={(e) => setUpdatedPrice(e.target.value)}
                          className="w-20 border border-gray-300 rounded px-1 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:border-green-500"
                        />
                        <button
                          onClick={() => handleUpdatePrice(product._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-green-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {currency}{product.offerPrice}
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-green-800 ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input onClick={() => toggleStock(product._id, !product.inStock)}
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-green-600/100 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
