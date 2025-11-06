import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const ProductService = {
  getProducts: () => fetchData("/products"),
  deleteProduct: (id) => deleteData(`/products/${id}`),

  createProduct: (data, image) => {
    const fields = {
      ...data,
      extras: JSON.stringify(data.extras || []),
      meatOptions: data.meatOptions ? JSON.stringify(data.meatOptions) : null,
    };

    return uploadFormData({
      endpoint: "/products",
      fields,
      file: image,
      fileKey: "image",
      method: "POST",
    });
  },

  updateProduct: (id, data, image) => {
    const fields = {
      ...data,
      description: data.description || "",
      extras: JSON.stringify(data.extras || []),
      meatOptions: data.meatOptions ? JSON.stringify(data.meatOptions) : null,
    };

    return uploadFormData({
      endpoint: `/products/${id}`,
      fields,
      file: image,
      fileKey: "image",
      method: "PUT",
    });
  },
};
