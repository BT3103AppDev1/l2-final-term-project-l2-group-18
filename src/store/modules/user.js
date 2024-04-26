import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, getFirestore } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    data: null,
    uid: null,
    pic: null,
    username: null
  },
  getters: {
    userState(state) { // Modified Userstate getter from User
      return state;
    },
    userData(state) {
      return state.data;
    },
    userUID(state) {
      return state.uid;
    },
    userPIC(state) {
      return state.pic;
    },
    userName(state) {
      return state.username;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.loggedIn = value;
    },
    SET_USER(state, data) {
      state.data = data;
    },
    SET_UID(state, data) {
      state.uid = data;
    },
    SET_PHOTO_URL(state, url) {
      state.pic = url;
    },
    SET_USERNAME(state, username) {
      state.username = username;  
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

        // Send an email verification to the newly created user
        await sendEmailVerification(userCredentials.user)
        .then(() => {
          console.log("Verification email sent.");
        })
        .catch((verificationError) => {
          console.error("Failed to send verification email:", verificationError);
        });

        await setDoc(doc(getFirestore(), "users", userCredentials.user.uid), {
          username,
          email,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/htlv-e4a45.appspot.com/o/profile_pics%2Fdefault%2Favatar_default.jpg?alt=media&token=eca40c65-a599-45bc-95a8-69b280097f15"
        });

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
        const user_uid = userCredentials.user.uid;

        // Check if user already exists in Firestore
        const userDoc = await getDoc(doc(getFirestore(), "users", user_uid))

        // Store new user data in Firestore for new accounts
        if (!userDoc.exists()) {
          await setDoc(doc(getFirestore(), "users", user_uid), {
            username: userCredentials.user.displayName, // Need to see whether we want to take their Google name as username
            email: userCredentials.user.email,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/htlv-e4a45.appspot.com/o/profile_pics%2Fdefault%2Favatar_default.jpg?alt=media&token=eca40c65-a599-45bc-95a8-69b280097f15"
          });
        }
        commit("SET_LOGGED_IN", true);
        return user_uid;
      } catch (error) {
          throw error;
      }
    },
    async login({ commit }, { email, password }) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          commit("SET_LOGGED_IN", true);
          const user_uid = userCredential.user.uid;
          return { user_uid: user_uid, isVerified: true };
        } else {
          // Handle the case where the email is not verified
          this.loginError = "Please verify your email address to proceed.";
          console.log("ERROR LOG", this.loginError)
          return { user_uid: user.uid, isVerified: false };
        }
      } catch (error) {
        this.loginError = error.message;
        console.error("Login Error", error)
        throw error
      }
    },
    async fetchUserData({ commit }, userId) {
      commit("SET_UID", userId);
      const db = getFirestore();
      const docRef = doc(db, "users", userId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          commit("SET_USER", docSnap);
          commit("SET_PHOTO_URL", docSnap.data().photoURL)
          commit('SET_USERNAME', docSnap.data().username)
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
        commit('SET_UID', null);  // Clear user data from state
        commit('SET_USER', null);  // Clear user data from state
        commit('SET_USERNAME', null) // Clear user data from state
        commit('SET_LOGGED_IN', false);
        console.log("User signed out successfully");
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;  
      }
    },

    async updatePhoto({ commit }, url) {
      commit("SET_PHOTO_URL", url);
    },
    async updateUsername({ commit }, { userId, username }) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      try {
          await updateDoc(userRef, { username: username });
          commit('SET_USERNAME', username);  // Commit new username to store
      } catch (error) {
          console.error("Error updating username:", error);
          throw error;  // Rethrow to handle in component
      }
    },
  },
};
