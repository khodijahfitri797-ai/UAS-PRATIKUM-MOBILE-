import axios, { AxiosError } from 'axios';

const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
}

function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? axiosError.message ?? 'Terjadi kesalahan jaringan';
  }
  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan tidak dikenal';
}

export async function fetchProducts(
  params: { limit?: number; skip?: number } = {},
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  try {
    const { limit = 100, skip = 0 } = params;
    const { data } = await client.get<ProductListResponse>('/products', {
      params: { limit, skip },
      signal,
    });
    return data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  try {
    const { data } = await client.get<Product>(`/products/${id}`, { signal });
    return data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  try {
    const { data } = await client.get<(Category | string)[]>('/products/categories', { signal });
    return data.map((item) =>
      typeof item === 'string' ? { slug: item, name: item, url: '' } : item,
    );
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function searchProducts(query: string, signal?: AbortSignal): Promise<ProductListResponse> {
  try {
    const { data } = await client.get<ProductListResponse>('/products/search', {
      params: { q: query },
      signal,
    });
    return data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function fetchProductsByCategory(
  category: string,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  try {
    const { data } = await client.get<ProductListResponse>(`/products/category/${category}`, { signal });
    return data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function loginUser(payload: LoginPayload, signal?: AbortSignal): Promise<LoginResponse> {
  try {
    const { data } = await client.post<LoginResponse>('/auth/login', payload, { signal });
    return data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}
