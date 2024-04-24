<template>
  <NavBar /> 
  <div class = "content-container"> 
    <div class = "places">
      <PlacesToVisitGlobal @route-requested="handleRouteRequest" :itineraryId="itineraryId"/>
    </div>
    <div class = "maps">
      <GoogleMaps ref="googleMaps" :selectedPlace= "selectedPlace"/>
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
    },

    handleRouteRequest(route) {
      this.$refs.googleMaps.displayRoute(
        route.originLat,
        route.originLng,
        route.destLat,
        route.destLng
      );
    },
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
