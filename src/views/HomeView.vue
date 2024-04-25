<template>
  <div class="home-view">
  <NavBar />
  <video id="backgroundVideo" autoplay muted loop>
        <source src="../assets/clouds2.mp4" type="video/mp4">
  </video>
  <div class="home-page">
    <Explore />
    <h1 class="recent-itineraries">Your Recent Itineraries</h1>
    <ItineraryList class= "ur_itineraries" type="personal" limit="4"/>
    <SearchLocation />
  </div>
    </div>
</template>
  
<script>
import SearchLocation from '@/components/SearchLocation.vue';
import ItineraryList from '@/components/ItineraryList.vue';
import NavBar from '@/components/NavBar.vue';
import Explore from '@/components/Explore.vue'
  export default {
    name: 'HomeView',
    components: {
      SearchLocation,
      ItineraryList,
      NavBar,
      Explore,
    },
    mounted() {
      const backgroundVideo = document.getElementById('backgroundVideo');
      if (backgroundVideo) {
        backgroundVideo.style.position = 'fixed';
        backgroundVideo.style.top = '0';
        backgroundVideo.style.left = '0';
        backgroundVideo.style.width = '100%';
        backgroundVideo.style.height = '100vh';
        backgroundVideo.style.objectFit = 'cover';
        backgroundVideo.style.zIndex = -10;
        backgroundVideo.style.opacity = '0.9';
  }
    }
  };
</script>
  
<style scoped>
  .home-page {
    position: relative;
    text-align: center;
    margin: 50px auto;
    width: 95%;
  }

  .recent-itineraries {
    font-size: 30px;
    font-weight: 510;
    text-align: center;
    text-transform: capitalize;
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

  .ur_itineraries {
    margin-bottom: 50px;
  }
  
</style>
  