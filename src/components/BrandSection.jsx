import React from "react";
import BrandCard from "./BrandCard";
import { useState, useEffect } from "react";
import { getBrands } from "../services/productService";

const BrandSection = () => {
   const [brands, setBrands] = useState([]);

     useEffect(() => {
       const fetchData = async () => {
         setBrands(await getBrands());
       };
       fetchData();
     }, []);
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Shop by <span className="text-indigo-600">Category</span>
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Explore our curated collections and find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((cat, index) => (
            <BrandCard key={index} logo={cat.logo} name={cat.name} slug={cat.slug} />

          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
