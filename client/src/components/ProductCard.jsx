import React from "react";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeCartItem, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        id={`product-card-${product._id}`}
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
      >
        {/* Product Image */}
        <div id={`product-image-${product._id}`} className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        <div className="text-gray-500/60 text-sm">
          {/* Category */}
          <p id={`product-category-${product._id}`}>{product.category}</p>

          {/* Name */}
          <p
            id={`product-name-${product._id}`}
            className="text-gray-700 font-medium text-lg truncate w-full"
          >
            {product.name}
          </p>

          {/* Rating */}
          <div id={`product-rating-${product._id}`} className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  className="md:w-3.5 w3"
                />
              ))}
            <p>(4)</p>
          </div>

          {/* Price + Cart */}
          <div id={`product-footer-${product._id}`} className="flex items-end justify-between mt-3">
            <p id={`product-price-${product._id}`} className="md:text-xl text-base font-medium text-primary">
              {currency}
              {product.offerPrice}{" "}
              <span
                id={`product-original-price-${product._id}`}
                className="text-gray-500/60 md:text-sm text-xs line-through"
              >
                {currency}
                {product.price}
              </span>
            </p>

            <div
              id={`product-cart-section-${product._id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-primary"
            >
              {!cartItems[product._id] ? (
                <button
                  id={`add-to-cart-${product._id}`}
                  className="flex items-center justify-center gap-1 bg-[#d5f2e6] border border-[#4fbf8b]/50 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div
                  id={`cart-quantity-controls-${product._id}`}
                  className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-[#4fbf8b]/10 rounded select-none"
                >
                  <button
                    id={`cart-decrement-${product._id}`}
                    onClick={() => removeCartItem(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span id={`cart-quantity-${product._id}`} className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    id={`cart-increment-${product._id}`}
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
