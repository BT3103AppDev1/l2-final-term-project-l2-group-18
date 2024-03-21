<template>
    <div class="login-form">
      <h2>Sign in to your HTLV account.</h2>
      <div class = "account-message">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
      <form @submit.prevent="login">
        <input v-model="email" type="text" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <a href="/forgot-password" class="forgot-password">Forgot your password?</a>
        <button type="submit" class="sign-in-button">Sign In</button>
      </form>
      <button @click="signInWithGoogle" class="google-sign-in-button">Continue with Google</button>
      <div class="additional-links">
        <a href="/help">Need help?</a>
        <a href="/usage">Usage</a>
      </div>
    </div>
</template>
  
<script>
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
export default {
    name: 'LoginForm',
    data() {
        return {
        email: '',
        password: '',
        loginError:'',
        };
    },
    methods: {
        async login() {
            if (!this.email || !this.password) {
                this.loginError = 'Email and password are required.';
                return;
            }

            const auth = getAuth();
            try {
                await signInWithEmailAndPassword(auth, this.email, this.password);
                console.log("Logged in successfully");
                this.$router.push('/itineraries')
            } catch (error) {
                this.loginError = error.message;
                console.error("Login Error:", error );
            }
        },
        async signInWithGoogle() {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const token = result.credential?.accessToken;
                const user = result.user;
                console.log("Google sign in successful", user);
                this.$router.push('/itineraries')
            } catch (error) {
                this.loginError = error;
                console.error("Google Sign In Error", error);
            }
        }
    },
};
</script>
  
<style scoped>
    .login-form {
    width: 400px;
    margin: 0 auto;
    text-align: center;
    }

    h2 {
    margin-bottom: 1.5rem;
    font-size: 24px;
    }

    .account-message {
        margin-bottom: 1.5rem;
        text-align: left;
        font-size: 16px;
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input {
        width: 100%;
        margin-bottom: 1rem;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    .forgot-password {
    margin-bottom: 0.5rem;
    color: #666;
    text-decoration: none;
    }

    .sign-in-button {
    width: 100%;
    padding: 0.5rem;
    background-color: #ff5b5b;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }
    .google-sign-in-button {
        margin-top: 1rem;
        background-color: #fff;
        color: black;
        border-radius: 20px;
        padding: 5px 10px;
    }

    .additional-links {
    margin-top: 1rem;
    }

    .additional-links a {
    margin-right: 1rem;
    color: #666;
    text-decoration: none;
    }
</style>