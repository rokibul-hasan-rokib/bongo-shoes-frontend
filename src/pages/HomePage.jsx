import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Star,
} from "lucide-react";
import ProductSection from "../components/ProductSection";
import ImageCarousel from "../components/ImageCarousel";
import { useEffect, useState } from "react";
import { getNewArrivals,getFeaturedProducts } from "../services/productService";
import BrandSection from "../components/BrandSection";

const HomePage = () => {
  const [newArrivals,SetNewArrivals]=useState([]);
  const [featuredProducts,setFeaturedProduct]=useState([])

   useEffect(() => {
      const fetchData = async () => {
        SetNewArrivals(await getNewArrivals());
        setFeaturedProduct(await getFeaturedProducts());

      };
      fetchData();
    }, []);

  return (
    <div>
      {/* Hero Section */}
      <ImageCarousel></ImageCarousel>

      {/* Shop By Categories */}
      {/* <BrandSection></BrandSection> */}

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked favorites from our collection"
        products={featuredProducts}
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Latest additions to our collection"
        products={newArrivals}
      />
      {/* Top Sell */}
      {/* <ProductSection
        title="Top Sell Products"
        subtitle="Maximum sell product to our collection"
        products={newArrivals}
      /> */}

  

    </div>
  );
}
export default HomePage



