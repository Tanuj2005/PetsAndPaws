const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  user_type: 'NGO' | 'Adopter';
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
  };
  redirect_url: string;
}

interface Pet {
  _id: string;
  ngo_user_id: string;
  name: string;
  type: string;
  age: number;
  location: string;
  image_url: string;
  vaccinated: boolean;
  neutered: boolean;
  medical_notes?: string;
  created_at: string;
}

interface PetsResponse {
  pets: Pet[];
  total: number;
  page: number;
  limit: number;
}

class ApiService {
  private getAuthHeader(): { Authorization: string } | {} {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
        },
      });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  async getPets(filters?: {
    type?: string;
    location?: string;
    limit?: number;
    skip?: number;
  }): Promise<PetsResponse> {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.skip) params.append('skip', filters.skip.toString());

    const response = await fetch(`${API_BASE_URL}/api/pets?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch pets');
    }

    return response.json();
  }

  async getPetById(id: string): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/pets/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch pet details');
    }

    return response.json();
  }

  async createPet(data: {
    name: string;
    type: 'Dog' | 'Cat';
    age: number;
    location: string;
    image_url: string;
    vaccinated: boolean;
    neutered: boolean;
    medical_notes?: string;
  }): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/api/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create pet');
    }

    return response.json();
  }

  async getNgoDashboard() {
    const response = await fetch(`${API_BASE_URL}/api/ngo/dashboard`, {
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch dashboard');
    }

    return response.json();
  }
}

export const api = new ApiService();
export type { Pet, AuthResponse, PetsResponse };
