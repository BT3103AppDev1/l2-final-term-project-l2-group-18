<template>
  <NavBar />
    <div class="home-page">
      <Explore />
      <ItineraryList type="community" limit="4"/>
      <h2>Your Recent Itineraries</h2>
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
    }
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
  