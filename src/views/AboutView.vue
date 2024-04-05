<template>
  <div>
    <NavBar />
    <div class="about-view">
      <div class="container">
        <div class="row">
          <div class="about-image">
            <img class="about-logo" src="../assets/about_page.jpg" alt="About Logo">
          </div>
          <div class="about-content">
            <h2 class="about-title">ABOUT <span class="highlight">HTLV</span></h2>
            <p>Welcome to Hasta La Vista (<span class="highlight">HTLV</span>) - your ultimate travel companion!</p>
            <p><span class="highlight">HTLV</span> is a revolutionary web application designed to simplify and enhance your travel planning experience. Say goodbye to the hassle of juggling multiple platforms and tools for itinerary creation and collaboration. With <span class="highlight">HTLV</span>, you can streamline your travel plans, discover new destinations, and connect with fellow travelers - all in one place.</p>
          </div>
        </div>
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
  }
};
</script>

<style scoped>
.about-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5% 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.about-image {
  flex: 1;
  margin-right: 2rem;
}

.about-logo {
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-content {
  flex: 1;
  max-width: 600px;
  padding-left: 2rem;
}

.about-title {
  font-size: 4em;
  font-weight: bold;
  color: #333;
  text-shadow: 0.1em 0.1em 0.2em rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.about-content p {
  font-size: 1.5em;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: justify;
}

.highlight {
  color: red;
}

@media screen and (max-width: 768px) {
  .about-image {
    flex: none;
    margin-right: 0;
    margin-bottom: 2rem;
  }
  .about-content {
    flex: none;
    max-width: none;
    padding-left: 0;
  }
}
</style>
