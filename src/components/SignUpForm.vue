<template>
    <div class="signup-form">
      <h2>Create an account with HTLV!</h2>

      <form @submit.prevent="submitCreateAccount">
        <button @click="submitSignInWithGoogle" class="google-sign-in-button">
            <img src = "../assets/google_logo.png" id = "google_logo">Sign up with Google</button>
      </form>

      <form @submit.prevent="submitCreateAccount">
        <div class="or_block">
            <hr class="line" />
            <h4>or</h4>
            <hr class="line" />
        </div>

        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="email" type = "email" placeholder = "email@example.com" required/>
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="retypePassword" type = "password" placeholder="Retype Password" required/>
        <div v-if="createAccountError" class="error-message" v-html="createAccountError">
        </div>
        <button type="submit" class="create-account-button">Create Account</button>
      </form>

      <div class = "account-message">
        Already have an account? 
        <a href="/login" class = "login">Login</a>
      </div>
    </div>
</template>
  
<script>
import {mapGetters, mapActions } from "vuex";
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
    computed: {
    ...mapGetters('user', ['userState', 'userData', 'userUID'])
    },
    methods: {
        ...mapActions('user', ['createAccount', 'signInWithGoogle', 'fetchUserData']),
        async submitCreateAccount() {
            if (!this.username || !this.email || !this.password || !this.retypePassword) {
                this.createAccountError = '⚠️All fields are required.';
                return;
            }

            if (this.password !== this.retypePassword) {
                this.createAccountError = '⚠️Passwords do not match.'
                return;
            }

            if (!this.isValidPassword(this.password)) {
                this.createAccountError = '⚠️Password does not meet the required criteria: <br>' +
                                            '- Must be at least 8 characters long.<br>' +
                                            '- Must include at least one uppercase letter.<br>' +
                                            '- Must include at least one lowercase letter.<br>' +
                                            '- Must include at least one number (0-9).<br>';
                return;
            }

            try {
                const user_uid = await this.createAccount({ email: this.email, password: this.password, username: this.username });
                await this.fetchUserData(user_uid);

                console.log(this.userUID);
                console.log(this.userData.data());
                this.$router.push('/home');
            } catch (error) {
                this.createAccountError = error.message;
                console.error("Account creation error:", error);
            }
        },
        async submitSignInWithGoogle() {
            try {
                const user_uid = await this.signInWithGoogle();
                await this.fetchUserData(user_uid);

                console.log(this.userUID);
                console.log(this.userData.data());
                this.$router.push('/home');
            } catch (error) {
                this.createAccountError = error.message;
                console.error("Google Sign In Error", error);
            }
        },
        isValidPassword(password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;
            return passwordRegex.test(password);
        },
    },
};
</script>
  
<style scoped>
    .signup-form {
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
    padding: 0px;
    }

    input {
        width: 80%;
        margin-bottom: 1rem;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }

    .create-account-button {
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

    .create-account-button:hover {
    border: 2px solid black; /* Change border color */
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3); /* Add shadow effect */
    }

    .account-message {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 14px;
    color: #666;
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

    .error-message {
    color: red; /* Error text color */
    background-color: #ffe0e0; /* Light red background color */
    padding: 10px; /* Some padding around the text */
    border-radius: 5px; /* Rounded corners */
    margin-bottom: 15px; /* Space below the error message */
    text-align: left;
    width:80%;
    }

</style>