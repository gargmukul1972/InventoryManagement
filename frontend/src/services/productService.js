import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getProducts = async () => {
  const response = await api.get("/product");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post(
    "/product",
    product
  );

  return response.data;
};

export const updateProduct = async (
  id,
  product
) => {
  const response = await api.put(
    `/product/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id
) => {
  await api.delete(`/product/${id}`);
};