<template>
    <div class="forgot-password-form">
        <h2>Forgot your password?</h2>

        <div v-if="emailSent" class="success-message">
        A link to reset your password has been sent to your email. 
        <div>You will be redirected back to the login page in <strong>{{ countdown }}</strong> seconds.</div>
        </div>

        <div v-else class="forget-pw-main">
            <div class = "account-message">
                Enter your email and we'll send you a link to reset your password!
            </div>
            <form @submit.prevent="reset">
                <input v-model="email" type="email" placeholder="Email" required />
                <button type="submit" class="reset-button">Send password reset link &rarr;</button>
            </form>
        </div>

        <div v-if="resetError" class="error-message">{{ resetError }}</div>

        <div class = "account-message2">
            Hold on.. I remember it now!  
            <a href="/login" class = "login"> Back to Login</a>
        </div>
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
            emailSent: false,
            countdown: 10,
        }
    },
    methods: {
        async reset() {
            if (!this.email) {
                this.resetError = 'Please type in a valid email address';
                return;
            }

            const auth = getAuth();
            try {
                await sendPasswordResetEmail(auth, this.email);
                console.log("Email sent successfully");
                this.resetError = ""
                this.emailSent = true;
                this.startCountdown();
            } catch (error) {
                this.resetError = error.message;
                console.error("Reset Error:", error );
            }
        },
        startCountdown() {
            const interval = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown -= 1;
                } else {
                    clearInterval(interval);
                    this.redirectToLogin();
                }
            }, 1000);
        },
        redirectToLogin() {
            this.$router.push('/login');
        }
    },
};
</script>

<style scoped>

h2 {
    margin-bottom: 1rem;
    font-size: 24px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.success-message, .error-message {
    color: green;
    font-size: 18px;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 400;
}
.error-message {
    color: red;
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
</style>