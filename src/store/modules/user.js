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
    userState(state) { // Modified Userstate getter from User
      return state;
    },
    userData(state) {
      return state.data
    }
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

        console.log("Account created successfully", userCredentials.user.username);
        await setDoc(doc(getFirestore(), "users", userCredentials.user.uid), {
          username,
          email,
        });

        commit("SET_LOGGED_IN", true);

        const user_uid = userCredentials.user.uid;
        return user_uid;

      } catch (error) {
        throw error;
      }
    },
    async signInWithGoogle({ commit }) {   // This is the same funcition for sign in or create account with google
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const userCredentials = await signInWithPopup(auth, provider);

        // Store user data in Firestore when sign in or create account with google
        await setDoc(doc(getFirestore(), "users", userCredentials.user.uid), {
          username: userCredentials.user.displayName, // Need to see whether we want to take their Google name as username
          email: userCredentials.user.email
        });

        commit("SET_LOGGED_IN", true);

        const user_uid = userCredentials.user.uid;
        return user_uid;
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

        commit("SET_LOGGED_IN", true);

        const user_uid = userCredential.user.uid;
        return user_uid;

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
          commit("SET_USER", docSnap);
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
