<template>
    <NavBar />
      <div class="my-itineraries-page">
        <h2>Your Itineraries</h2>
        <ItineraryList type="personal"/>
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
      },
      mounted() {
        document.body.style.backgroundColor = "#e7dcdc";
      }
    };
  </script>
    
  <style scoped>
    .my-itineraries-page {
      text-align: center;
      margin-top: 50px;
      width: 75%;
      margin-left: auto;
      margin-right: auto;
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
    