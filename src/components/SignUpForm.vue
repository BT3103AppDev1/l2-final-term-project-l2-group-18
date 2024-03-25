<template>
    <div class="signup-form">
      <h2>Create an account with HTLV!</h2>
      <div class = "account-message">
        Already have an account? <a href="/login">Login</a>
      </div>
      <form @submit.prevent="submitCreateAccount">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="email" type = "email" placeholder = "email@example.com" required/>
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="retypePassword" type = "password" placeholder="Retype Password" required/>
        <button type="submit" class="create-account-button">Create Account</button>
      </form>
      <button @click="submitSignInWithGoogle" class="google-sign-in-button">Continue with Google</button>
      <div class="additional-links">
        <a href="/help">Need help?</a>
        <a href="/usage">Usage</a>
      </div>
    </div>
</template>
  
<script>
import { mapActions } from "vuex";
export default {
    name: 'SignUpForm',
    data() {
        return {
        username: '',
        email: '',
        password: '',
        retypePassword: '',
        createAccountError:'',
        };
    },
    methods: {
        ...mapActions('user', ['createAccount', 'signInWithGoogle']),
        async submitCreateAccount() {
            if (!this.username || !this.email || !this.password || !this.retypePassword) {
                this.createAccountError = 'All fields are required.';
                return;
            }

            if (this.password !== this.retypePassword) {
                this.createAccountError = 'Passwords do not match.'
                return;
            }

            try {
                await this.createAccount({ email: this.email, password: this.password, username: this.username });
                this.$router.push('/itineraries');
            } catch (error) {
                this.createAccountError = error.message;
                console.error("Account creation error:", error);
            }
        },
        async submitSignInWithGoogle() {
            try {
                await this.signInWithGoogle();
                this.$router.push('/itineraries');
            } catch (error) {
                this.createAccountError = error.message;
                console.error("Google Sign In Error", error);
            }
        },
        // async addUserToFirestore(user) {
        //     const db = getFirestore();
        //     try {
        //         await setDoc(doc(db, "users", user.uid), {
        //             username: this.username,
        //             email: this.email,
        //         }
        //     );
        //     console.log("User added to Firestore");
        //     } catch (error) {
        //         console.log("Error adding user to Firestore:", error);
        //         this.createAccountError = error.message;
        //     }
        // }
    },
};
</script>
  
<style scoped>
    .signup-form {
    width: 400px;
    margin: 0 auto;
    text-align: center;
    }

    h2 {
    margin-bottom: 1.5rem;
    font-size: 24px;
    text-align: left;
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

    .create-account-button {
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