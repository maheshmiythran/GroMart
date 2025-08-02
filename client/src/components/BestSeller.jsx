import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext.jsx';

const BestSeller = () => {
  const { products } = useAppContext();

  const bestSellingProducts = products
    ?.filter(product => product.inStock)
    .slice(0, 6);

  return (
    <div className="mt-16 px-4 sm:px-6 md:px-8">
      <p className="text-xl sm:text-2xl md:text-3xl font-medium text-center sm:text-left">
        Best Sellers
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {bestSellingProducts?.length > 0 ? (
          bestSellingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No best sellers available.
          </p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
