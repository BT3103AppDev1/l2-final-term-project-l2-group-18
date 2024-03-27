import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    data: null,
  },
  getters: {
    user(state) {
      return state;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.loggedIn = value;
    },
    SET_USER(state, data) {
      state.data = data;
    },
  },
  actions: {
    async createAccount({ commit }, { email, password, username }) {
      const auth = getAuth();
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Account created successfully", userCredentials.user);
        await setDoc(doc(getFirestore(), "users", userCredentials.user.uid), {
          username,
          email,
        });
        commit("SET_USER", userCredentials.user);
        commit("SET_LOGGED_IN", true);
        return userCredentials.user;
      } catch (error) {
        throw error;
      }
    },
    async signInWithGoogle({ commit }) {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        commit("SET_USER", result.user);
        commit("SET_LOGGED_IN", true);
        return result.user;
      } catch (error) {
        throw error;
      }
    },
    async login({ commit }, { email, password }) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        commit("SET_USER", userCredential.user);
        commit("SET_LOGGED_IN", true);
        return userCredential.user; // to use in the component for routing or other logic
      } catch (error) {
        throw error; // rethrow to catch in the component
      }
    },
    async fetchUserData({ commit }, userId) {
      const db = getFirestore();
      const docRef = doc(db, "users", userId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // You might want to store the fetched user data in the Vuex state
          console.log("User data:", docSnap.data());
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async signOut({ commit }) {
      const auth = getAuth();
      try {
        await signOut(auth);
        commit('SET_USER', null);  // Clear user data from state
        commit('SET_LOGGED_IN', false);
        console.log("User signed out successfully");
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;  
      }
    },
  },
};
