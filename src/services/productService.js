import axios from "axios";
import { API_BASE } from "./api";


// Fetch all categories
export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/categories/`);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

//  Fetch all brands
export const getBrands = async () => {
  try {
    const res = await axios.get(`${API_BASE}/brands/`);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Fetch products with filters & sort
export const getProducts = async (filters = {}, page = 1) => {
  try {
    const res = await axios.get(`${API_BASE}/products/`, {
      params: { ...filters, page },
    });
    return res.data; // contains count, next, previous, results
  } catch (error) {
    console.error("Error fetching products:", error);
    return { results: [], count: 0, next: null, previous: null };
  }
};

// new arrival

export const getNewArrivals = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products/`, {
      params: { ordering: "-created_at",page_size: 8 },
    });
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};

// featured Product
export const getFeaturedProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products/`, {
      params: { featured: true, page_size: 8 },
    });
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// product by slug
export const getProductBySlug = async (slug) => {
  try {
    const res = await axios.get(`${API_BASE}/products/${slug}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// product by category
export const getProductsByCategory = async (category_slug, exclude_slug = null) => {
  try {
    const res = await axios.get(`${API_BASE}/products/`, {
      params: { category: category_slug, page_size: 8 },
    });

    let products = res.data.results || res.data;

    if (exclude_slug) {
      products = products.filter((p) => p.slug !== exclude_slug);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// search products
export const searchProducts = async (query) => {
  try {
    const res = await axios.get(`${API_BASE}/products/`, {
      params: { search: query },
    });
    return res.data.results || [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
