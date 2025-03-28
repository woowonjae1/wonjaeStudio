const API_BASE_URL = 'http://localhost:8080/api';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true,
  } = options;

  // 如果需要认证，添加Authorization头
  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 设置默认headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 构建请求选项
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // 如果有body，添加到请求中
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  // 发送请求
  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  // 处理非2xx响应
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${response.status}`);
  }

  // 解析响应
  return response.json();
} 