<template>
  <NavBar />
    <div class="home-page">
      <h1>Welcome to HTLV!</h1>
      <ItineraryList />
      <SearchLocation />

    </div>
</template>
  
<script>
import SearchLocation from '@/components/SearchLocation.vue';
import ItineraryList from '@/components/ItineraryList.vue';
import NavBar from '@/components/NavBar.vue'
  export default {
    name: 'HomeView',
    components: {
      SearchLocation,
      ItineraryList,
      NavBar,
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
  