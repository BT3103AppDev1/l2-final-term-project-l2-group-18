<template>
  <div>
    <NavBar />
    <div class="about-hero">
      <img class="about-hero-image" src="../assets/about_page.jpg" alt="Group of friends">
      <div class="hero-content">
        <h1 class="hero-title">About Us</h1>
        <p class="hero-subtitle">For explorers everywhere.</p>
      </div>
    </div>
    <div class="container">
      <p>We believe that travel is for everyone. It helps us learn about ourselves and the world around us. With HTLV, planning your next adventure is just a few clicks away. Whether you want to create unforgettable itineraries or join our vibrant community, we're here to help you every step of the way.</p>
      <div class="button-container">
        <router-link to="/my-itineraries" class="cta-button">Start Planning</router-link>
        <router-link to="/community" class="cta-button">Popular itineraries</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "AboutView",
  components: {
    NavBar
  },
  mounted() {
    document.body.style.backgroundColor = "#e7dcdc";
  }
};
</script>

<style scoped>
.about-hero {
  position: relative;
  color: white;
  text-align: center;
}

.about-hero-image {
  width: 100%;
  height: 60vh;
  object-fit: cover;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex: 1;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0;
}

.about-main .container {
  padding: 4rem;
  text-align: justify;
  max-width: 1000px;
  margin: auto;
  word-wrap: break-word;
  hyphens: auto;
  text-align: justify;
  text-justify: inter-word;
  max-width : 1000px;
}

.container p {
  font-size: 1.2rem;
  text-align: justify;
  text-justify: inter-word;
  max-width: 1250px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
  hyphens: auto;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  margin-top: 2rem; 
}

.cta-button {
  padding: 1rem 2rem;
  margin: 0.5rem;
  color: white;
  background-color: #FF5A5F;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #FF2C3B;
}

@media (max-width: 576px) {
  .button-container {
    flex-direction: column;
  }
  .cta-button {
    display: block;
    width: auto;
    margin: 10px auto;
  }
}
</style>
