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
          <img id="logo1" src="../assets/HTLVlogo.png" alt="Logo" class = "animated-logo">
          <div id = "CTA">
          <h1>Unlock the Ultimate Travel Experience with Our Trip Planner!</h1>
          <p>Revolutionize Your Travel Planning with Our Powerful AI-Powered Itinerary Builder</p>
          <button @click="goToLogin" id="start-btn">Start Your Journey</button>
          </div>
        </section>
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
    background-color: rgba(176, 186, 191, 0.3);

  }
  
  #logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  nav button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  #login-btn {
    border: 2px solid black;
    color: black;
    background-color: transparent;
    font-size: small;
  }

  #login-btn:hover {
    border: 2px solid #FF5A5F; /* Change border color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
    background-color: #4cd137;
}
  
  #signup-btn {
    border: 2px solid black;
    color: black;
    background-color: transparent;
    font-size: small;
  }

  #signup-btn:hover {
    border: 2px solid #ff6b6b; /* Change border color */
    background-color: #4cd137;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}
  
  .call-to-action {
    padding: 6rem 1rem;
    position: relative;
    height: 100vh;
    background: url('../assets/landing_bg.jpg') ;
    background-size: cover;
    overflow: hidden;
  }

  #CTA {
    position: relative;
    transform: translateY(50%);
    text-align: center;
    font-size: 1.35rem;

  }
  
  #start-btn{
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer; 
    text-align: center;
  }
  
  #start-btn {
    background-color: #4cd137;
    color: #fff;
  }

  #start-btn:hover {
    border: 2px solid #FF5A5F; /* Change border color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

@keyframes fly {
	0% {
		transform: translate(0, calc(13vh - 60px)) rotateZ(20deg);
		opacity: 1;
	}

	15% {
		transform: translate(18vw, calc(13vh - 60px)) rotateZ(20deg);
	}

	25% {
		transform: translate(25vw, calc(20vh - 60px)) rotateZ(45deg);
	}

	30% {
		transform: translate(30vw, calc(20vh - 60px)) rotateZ(20deg);
	}

	70% {
		transform: translate(70vw, calc(20vh - 60px)) rotateZ(10deg);
	}

	100% {
		transform: translate(100vw, calc(13vh - 60px)) rotateZ(0deg);
		opacity: 1;
	}
}


/* Apply animation to the logo */
.animated-logo {
  animation: fly 15s linear infinite; 
  transform: translateY(-50%); 
  position: absolute;
  width: 50px;
  height: auto;
  left: 0;
  top: 0;
  z-index: 999;
	pointer-events: none;
}
  
  </style>
  