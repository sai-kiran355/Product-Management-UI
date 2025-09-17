// import { create } from "zustand";

// export const useProductStore = create((set) => ({
// 	products: [],
// 	setProducts: (products) => set({ products }),
// 	createProduct: async (newProduct) => {
// 		if (!newProduct.name || !newProduct.image || !newProduct.price) {
// 			return { success: false, message: "Please fill in all fields." };
// 		}
// 		const res = await fetch("/api/products", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
//  			body: JSON.stringify(newProduct),
// 		});
// 		const data = await res.json();
// 		set((state) => ({ products: [...state.products, data.data] }));
// 		return { success: true, message: "Product created successfully" };
// 	},
// 	fetchProducts: async () => {
// 		const res = await fetch("/api/products");
// 		const data = await res.json();
// 		set({ products: data.data });
// 	},
// 	deleteProduct: async (pid) => {
// 		const res = await fetch(`/api/products/${pid}`, {
// 			method: "DELETE",
// 		});
// 		const data = await res.json();
// 		if (!data.success) return { success: false, message: data.message };

// 		// update the ui immediately, without needing a refresh
// 		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
// 		return { success: true, message: data.message };
// 	},
// 	updateProduct: async (pid, updatedProduct) => {
// 		const res = await fetch(`/api/products/${pid}`, {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(updatedProduct),
// 		});
// 		const data = await res.json();
// 		if (!data.success) return { success: false, message: data.message };

// 		// update the ui immediately, without needing a refresh
// 		set((state) => ({
// 			products: state.products.map((product) => (product._id === pid ? data.data : product)),
// 		}));

// 		return { success: true, message: data.message };
// 	},
// }));

import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok)
        return { success: false, message: `Server error: ${res.status}` };

      const data = await res.json();
      console.log("Product created:", data.data); // ✅ see in console

      set((state) => ({ products: [...state.products, data.data] })); // add to store
      return { success: true, message: "Product created successfully" };
    } catch (err) {
      console.error("Error creating product:", err);
      return { success: false, message: err.message };
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      set({ products: data.data });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  },

  // ✅ DELETE PRODUCT
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
        method: "DELETE",
      });

      if (!res.ok)
        return { success: false, message: `Server error: ${res.status}` };

      const data = await res.json();

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return {
        success: true,
        message: data.message || "Product deleted successfully",
      };
    } catch (err) {
      console.error("Error deleting product:", err);
      return { success: false, message: err.message };
    }
  },

  // ✅ UPDATE PRODUCT
  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok)
        return { success: false, message: `Server error: ${res.status}` };

      const data = await res.json();

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: "Product updated successfully" };
    } catch (err) {
      console.error("Error updating product:", err);
      return { success: false, message: err.message };
    }
  },
}));
