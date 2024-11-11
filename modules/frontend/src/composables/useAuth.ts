import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { Cookies } from "quasar";
import { useRouter } from "vue-router";
import type { RegForm, Form } from "src/utils/validators";

export interface User {
  id: string;
  email: string;
  nickname: string;
  name: string;
  surname: string;
  notificationStatus: "ENABLED" | "DISABLED" | null;
}

interface AuthResponse {
  token: string;
  user: User;
}

export function useAuth() {
  const router = useRouter();
  // Retrieve token and user from localStorage or set to null if not found
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  // Check if the user is authenticated based on the token
  const isAuthenticated = computed(() => !!token.value);

  // Function to store authentication data
  const setAuthData = (authData: AuthResponse) => {
    token.value = authData.token;
    user.value = authData.user;

    if (token.value && user.value) {
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value)); // Stringify user object
    }
  };

  // Login function
  const login = async (form: Form) => {
    try {
      const response = await api.post<AuthResponse>("/user/login", form);
      console.log(response.data);
      setAuthData(response.data);
      router.push("/");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Register function
  const register = async (form: RegForm) => {
    try {
      let response = await api.post<AuthResponse>("/user/register", form);
      if (response.status !== 201) {
        throw new Error();
      }
      response = await api.post<AuthResponse>("/user/login", {
        email: form.email,
        password: form.password,
      });
      setAuthData(response.data);
      router.push("/");
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post<AuthResponse>("/user/logout");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // Function to check if the user is already authenticated
  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser); // Parse user object
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}
