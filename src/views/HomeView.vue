<template>
  <NavBar />
    <div class="home-page">
      <Explore />
      <ItineraryList type="community" limit="4"/>
      <h1 class="recent-itineraries">Your Recent Itineraries</h1>
      <ItineraryList type="personal" limit="4"/>
      <SearchLocation />

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
      document.body.style.backgroundColor = "#e7dcdc";
    }
  };
</script>
  
<style scoped>
  .home-page {
    text-align: center;
    margin: 50px auto;
    width: 75%;
  }

  .recent-itineraries {
    font-size: 30px;
    font-weight: 510;
    text-align: center;
    text-transform: capitalize;
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
  