import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div id="all-products-page" className="mt-16 flex flex-col">
      <div id="all-products-header" className="flex flex-col items-end w-max">
        <p id="all-products-title" className="text-2xl font-medium uppercase">
          All Products
        </p>
        <div id="all-products-title-underline" className="w-31 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div
        id="all-products-grid"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6"
      >
        {filteredProducts
          .filter(product => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
