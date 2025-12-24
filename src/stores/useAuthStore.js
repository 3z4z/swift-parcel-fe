import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.config";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningIn: false,
  isAuthLoading: true,
  isUserReady: false,
  error: "",

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
      const firebaseUser = result.user;
      set({ user: firebaseUser, isUserReady: true });
      return { user: firebaseUser };
    } catch (err) {
      set({ error: err.message });
      return { error: err.message };
    } finally {
      set({ isSigningIn: false });
    }
  },
  logout: async () => {
    await signOut(auth);
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
