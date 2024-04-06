<template>
  <NavBar /> 
  <div class = "content-container"> 
    <div class = "places">
      <PlacesToVisit />
    </div>
    <div class = "maps">
      <GoogleMaps />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue"
import GoogleMaps from "../components/GoogleMaps.vue"
import PlacesToVisit from "@/components/PlacesToVisit.vue";
export default {
  name: "Itineraries",
  components: {
    PlacesToVisit,
    GoogleMaps,
    NavBar
  },
};
</script>

<style scoped>
.content-container {
  display: flex;
  width: 100vw; 
  height: calc(100vh - 9vh); /* Since navbar occupies 9vh */
}

.places, .maps {
  flex: 1;
}

.places {
  overflow-y: auto;
}

</style>
