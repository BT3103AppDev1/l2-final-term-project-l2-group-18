<template>
  <NavBar /> 
  <div class = "content-container"> 
    <div class = "places">
      <PlacesToVisitGlobal :itineraryId="itineraryId"/>
    </div>
    <div class = "maps">
      <GoogleMaps :selectedPlace= "selectedPlace"/>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue"
import GoogleMaps from "../components/GoogleMaps.vue"
import PlacesToVisitGlobal from "@/components/PlacesToVisitGlobal.vue";
export default {
  name: "Itineraries",
  props:['itineraryId'],
  components: {
    PlacesToVisitGlobal,
    GoogleMaps,
    NavBar
  },
  data() {
    return {
      selectedPlace: null
    };
  },
  methods: {
    handlePlaceSelection(place) {
      this.selectedPlace = place;
    }
  }
};
</script>

<style scoped>
.content-container {
  display: flex;
  width: 100vw; 
  height: calc(100vh - 70px); /* Since navbar occupies 9vh */
}

.places, .maps {
  flex: 1;
  position: relative;
}

.places {
  overflow-y: auto;
}

#itineraries_tab {
  background-color: aquamarine;
}

</style>
