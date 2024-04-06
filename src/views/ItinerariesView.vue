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
}

.places, .maps {
  height: 100%;
  flex: 1;
}

</style>
