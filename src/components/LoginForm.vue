<template>
  <div class="login-form">
    <h2>Log in to your HTLV account</h2>

    <form @submit.prevent="submitLogin">
      <button @click="submitSignInWithGoogle" class="google-sign-in-button">
      <img src = "../assets/google_logo.png" id = "google_logo">
      Continue with Google
      </button>

      <div class="or_block">
        <hr class="line" />
        <h4>or</h4>
        <hr class="line" />
      </div>

      <input id="email_input" v-model="email" type="text" placeholder="Email" required />
      <input 
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <p v-if="showError" id="error">⚠️Username or Password is incorrect</p>

      <a href="/forgot-password" class="forgot-password">
      Forgot password?
      </a>
      
      <button type="submit" class="sign-in-button">Sign In</button>
    </form>

    <div class="account-message"> 
      Don't have an account? 
      <a href="/signup" class="sign-up">Sign up</a>
    </div>


    <!-- <div class="additional-links">
      <a href="/help">Need help?</a>
      <a href="/usage">Usage</a>
    </div> -->
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      loginError: "",
      showError: false, 
    };
  },
  computed: {
    ...mapGetters('user', ['userState', 'userData', 'userUID'])
  },
  methods: {
    ...mapActions('user', ['login', 'signInWithGoogle', 'fetchUserData']),
    async submitLogin() {
      if (!this.email || !this.password) {
        this.loginError = "Email and password are required.";
        return;
      }
      try {
        const user_uid = await this.login({ email: this.email, password: this.password });
        console.log("Logged in successfully");
        await this.fetchUserData(user_uid);
        this.$router.push("/home");
        console.log(this.userUID);
        console.log(this.userData.data());
      } catch (error) {
        this.loginError = error.message;
        this.showError = true;
        console.error("Login Error:", error);
      }
    },
    async submitSignInWithGoogle() {
      try {
        const user_uid = await this.signInWithGoogle();
        console.log("Google sign in successful");
        await this.fetchUserData(user_uid);
        this.$router.push("/itineraries");
        console.log(this.userUID);
        console.log(this.userData.data());
      } catch (error) {
        this.loginError = error;
        console.error("Google Sign In Error", error);
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 400px;
  margin: 0 auto;
  display: grid;
  align-content: center;
  overflow: hidden;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 24px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#google_logo {
  height: 20px;
  width: auto;
  padding-right: 15px;
}

.google-sign-in-button {
  background-color: white;
  border-radius: 20px; 
  padding: 0.5rem;
  width: 85%;
  cursor: pointer;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: 2px solid transparent;
}

.google-sign-in-button:hover {
  border: 2px solid #FF5A5F; /* Change border color */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
  background-color: #f4efef;
}

.line {
  width: 7vw;
  border: none;
  border-top: 1px solid #d7c9c9; /* Style the line */
  margin: 0 20px; /* Adjust margin to create space between the line and text */
  }

.or_block {
  display: flex;
  align-items: center;
  padding: 4px;
}

input {
  width: 80%;
  margin-bottom: 0.3rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  font-size: 16px;
  border-radius: 8px; 
}

#email_input {
  margin-bottom: 1rem;
}

.forgot-password {
  margin-bottom: 0.5rem;
  color: #666;
  text-decoration: underline;
  font-size: 14px;
  padding-bottom: 2px;
}

.forgot-password:hover {
  color: black;
}


.sign-in-button {
  width: 84%;
  padding: 0.5rem;
  background-color: #ff5b5b;
  color: #fff;
  border: 2px solid transparent;
  border-radius: 20px; 
  cursor: pointer;
  font-size: 16px;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}

.sign-in-button:hover {
  border: 2px solid black; /* Change border color */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

.account-message {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.sign-up {
  text-decoration: underline;
  font-weight: bold;
  color: #666;
}

.sign-up:hover {
  text-decoration: underline;
  font-weight: bold;
  color: black;
}

#error {
  color: rgba(255, 0, 0, 0.582);
  text-align: left;
  width: 85%;
  margin-bottom: 1rem;
  margin-top:-0.3rem;
}

</style>
