import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { axiosInstance } from "../utils/axiosInstance";

export const useAuthStore = create((set, get) => ({
  user: null,
  isSigningIn: false,
  isAuthLoading: true,
  isUserReady: false,
  error: "",

  sendTokenToBackend: async (user) => {
    if (!user) return;
    const idToken = await user.getIdToken();
    await axiosInstance.post(
      "/users/login",
      { idToken },
      { withCredentials: true }
    );
    set({ isCookieReady: true });
  },

  register: async (name, email, password) => {
    set({ isSigningIn: true });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      await updateProfile(user, {
        displayName: name,
      });
      await get().sendTokenToBackend(user);
      set({ user });
      return { user };
    } catch (err) {
      set({ error: err.message });
      return { error: err.message };
    } finally {
      set({ isSigningIn: false });
    }
  },
  login: async (email, password) => {
    set({ isSigningIn: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await get().sendTokenToBackend(user);
      set({ user, isUserReady: true });
      return { user };
    } catch (err) {
      set({ error: err.message });
      return { error: err.message };
    } finally {
      set({ isSigningIn: false });
    }
  },
  logout: async () => {
    await signOut(auth);
    await axiosInstance.post("/users/logout", {}, { withCredentials: true });
    set({
      user: null,
      isUserReady: false,
      isAuthLoading: false,
      isSigningIn: false,
    });
  },
  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        set({
          user: null,
          isAuthLoading: false,
          isUserReady: false,
        });
        return;
      }
      set({
        user: currentUser,
        isAuthLoading: false,
        isUserReady: true,
      });
    });
    return unsubscribe;
  },
}));
