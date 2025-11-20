import React from "react";
import { Link } from "react-router-dom";

const BrandCard = ({ logo, name, slug }) => {
  return (
    <Link
      to={`/products?brand=${slug}`}
      className="h-40 w-full overflow-hidden rounded-md shadow-sm hover:shadow-md transition duration-300 bg-white flex items-center justify-center"
    >
      <img
        src={logo}
        alt={name}
        className="max-h-full max-w-full object-contain"
      />
    </Link>
  );
};

export default BrandCard;
