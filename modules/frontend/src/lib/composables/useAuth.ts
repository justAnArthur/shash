import { computed, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import type { Form, RegForm } from "src/utils/validators";

export interface User {
  id: string;
  email: string;
  nickname: string;
  name: string;
  surname: string;
  notificationStatus: "ONLINE" | "DND" | "OFFLINE";
  notifyWhenTagged: "ALL" | "TAGGED";
}

interface AuthResponse {
  token: string;
  user: User;
}

export function useAuth() {
  const router = useRouter();
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  const isAuthenticated = computed(() => !!token.value);

  const setAuthData = (authData: AuthResponse) => {
    token.value = authData.token;
    user.value = authData.user;

    if (token.value && user.value) {
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value)); // Stringify user object
    }
  };

  const login = async (form: Form) => {
    try {
      const response = await api.post<AuthResponse>("/user/login", form);
      setAuthData(response.data);
      router.push("/");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

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

  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser); // Parse user object
    }
  };

  function getUserFromServer() {
    if (isAuthenticated.value) {
      api.get<User>("/user/me").then((response) => {
        user.value = response.data;
        localStorage.setItem("user", JSON.stringify(user.value)); // Stringify user object
      });
    }
  }

  if (
    !user.value ||
    !user.value.notificationStatus ||
    !user.value.notifyWhenTagged
  ) {
    getUserFromServer();
  }
  return {
    token,
    user,
    getUserFromServer,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}
