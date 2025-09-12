import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

const AuthService = {
  // Registrazione utente
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login utente
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login con Google
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Logout utente
  logout: () => {
    localStorage.removeItem('user');
  },

  // Ottieni utente corrente
  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Ottieni token JWT
  getToken: (): string | null => {
    const user = AuthService.getCurrentUser();
    return user?.token || null;
  },

  // Verifica se l'utente è autenticato
  isAuthenticated: (): boolean => {
    return !!AuthService.getToken();
  },
};

export default AuthService;
