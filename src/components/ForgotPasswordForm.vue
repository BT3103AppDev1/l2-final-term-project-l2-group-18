<template>
    <div class="forgot-password-form">
      <h2>Forgot your password?</h2>

      <div class = "account-message">
        Enter your email and we'll send you a link to reset your password!
      </div>

      <form @submit.prevent="reset">
        <input v-model="email" type="text" placeholder="Email" required />
        <button type="submit" class="reset-button">Send password reset link &rarr;</button>
      </form>

      <div class = "account-message2">
        Hold on.. I remember it now!  
        <a href="/login" class = "login"> Back to Login</a>
      </div>

      <!-- <div class="additional-links">
        <a href="/help">Need help?</a>
        <a href="/usage">Usage</a>
      </div> -->
    </div>
</template>
  
<script>
import {getAuth, sendPasswordResetEmail} from "firebase/auth"
export default {
    name: 'ForgetPasswordForm',
    data() {
        return {
        email: '',
        resetError:'',
        };
    },
    methods: {
        async reset() {
            if (!this.email) {
                this.loginError = 'Please type in a valid email address';
                return;
            }

            const auth = getAuth();
            try {
                await sendPasswordResetEmail(auth, this.email);
                console.log("Email sent successfully");
            } catch (error) {
                this.loginError = error;
                console.error("Reset Error:", error );
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
    margin-bottom: 1rem;
    font-size: 24px;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .account-message {
        margin-bottom: 1rem;
        text-align: left;
        font-size: 14px;
    }

    input {
        width: 90%;
        margin-bottom: 0.5rem;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }

    .reset-button {
    width: 84%;
    padding: 0.5rem;
    background-color: #ff5b5b;
    color: #fff;
    border: 2px solid transparent;
    border-radius: 20px; 
    cursor: pointer;
    font-size: 16px;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    }

    .reset-button:hover {
    border: 2px solid black; /* Change border color */
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3); /* Add shadow effect */
    }

    .account-message2 {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 0.1rem;
    }

    .login {
    text-decoration: underline;
    font-weight: bold;
    color: #666;
    }

    .login:hover {
    text-decoration: underline;
    font-weight: bold;
    color: black;
    }
    
    /* .additional-links {
        margin-top: 1rem;
    } */

    /* .additional-links a {
        margin-right: 1rem;
        color: #666;
        text-decoration: none;
    } */
</style>