import type { ApiResponse } from "@/types";

export class ApiError extends Error {
  status: number;
  errors?: { field?: string; message: string }[];

  constructor(
    message: string,
    status: number,
    errors?: { field?: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Normalize endpoint to start with /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `/api/backend${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    cache: "no-store",
  });

  const payload: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: "Failed to parse JSON response from server.",
    data: null as unknown as T,
  }));

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.message || `Request failed with status ${response.status}`,
      response.status,
      payload.errors
    );
  }

  return payload;
}

export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const qs = buildQueryString(params);
    return request<T>(`${endpoint}${qs}`, { method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: "DELETE" });
  },
};
