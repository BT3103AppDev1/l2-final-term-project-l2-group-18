<template>
    <div class="home-page">
      <h1>Welcome to HTLV!</h1>
      <button @click="goToSignup" class="button">SignUp</button>
      <button @click="goToLogin" class="button">Login</button>
    </div>
</template>
  
<script>
  export default {
    name: 'HomeView',
    methods: {
      goToLogin() {
        this.$router.push('/login');
      },
      goToSignup() {
        this.$router.push('/signup');
      },
    },
  };
</script>
  
<style scoped>
  .home-page {
    text-align: center;
    margin-top: 50px;
    
  }
  
  .button {
    padding: 10px 20px;
    background-color: #4285F4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin: 20px;
  }
  
</style>
  