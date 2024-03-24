<template>
    <div id="landing">
      <header>
        <div id="logo">HTLV</div>
        <nav>
          <button @click="goToLogin" id="login-btn">Log in</button>
          <button @click="goToSignup" id="signup-btn">Sign up</button>
        </nav>
      </header>
      <main>
        <section class="call-to-action">
          <h1>Adventure Awaits You</h1>
          <p>Discover the thrill of exploration with our custom travel plans</p>
          <button id="start-btn">Start Your Journey</button>
          <button id="app-btn">Download App</button>
        </section>
        <!-- Background image and overlay will be styled in CSS -->
        <div class="background-image">
          <div class="overlay"></div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LandingPage',
    methods: {
        goToLogin() {
            this.$router.push('/login');
        },
        goToSignup() {
            this.$router.push('/signup');
        },
    }
  }
  </script>
  
  <style scoped>
  #landing {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #fff;
  }
  
  #logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  nav button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  #login-btn {
    background-color: transparent;
  }
  
  #signup-btn {
    background-color: #ff6b6b;
    color: #fff;
  }
  
  .call-to-action {
    text-align: center;
    padding: 5rem 1rem;
  }
  
  #start-btn, #app-btn {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  #start-btn {
    background-color: #4cd137;
    color: #fff;
  }
  
  #app-btn {
    background-color: #487eb0;
    color: #fff;
  }
  
  .background-image {
    position: relative;
    height: 500px;
    background: url('/path-to-your-landing-page-background.jpg') no-repeat center center;
    background-size: cover;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
  </style>
  