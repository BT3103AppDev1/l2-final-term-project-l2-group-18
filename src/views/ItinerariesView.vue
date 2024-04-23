<template>
  <NavBar />
  <div class="content-container">
    <div class="places">
      <PlacesToVisit
        @route-requested="handleRouteRequest"
        :itineraryId="itineraryId"
        @destination-updated="handleDestinationUpdate"
      />
    </div>
    <div class="maps">
      <GoogleMaps
        ref="googleMaps"
        :selectedPlace="selectedPlace"
        :destination="destination"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import GoogleMaps from "../components/GoogleMaps.vue";
import PlacesToVisit from "@/components/PlacesToVisit.vue";
export default {
  name: "Itineraries",
  props: ["itineraryId"],
  components: {
    PlacesToVisit,
    GoogleMaps,
    NavBar,
  },
  data() {
    return {
      selectedPlace: null,
      destination: null,
    };
  },
  methods: {
    // handlePlaceSelection(place) {
    //   this.selectedPlace = place;
    // }

    handleRouteRequest(route) {
      this.$refs.googleMaps.displayRoute(
        route.originLat,
        route.originLng,
        route.destLat,
        route.destLng
      );
    },

    handleDestinationUpdate(newDestination) {
      this.destination = newDestination;
    },
  },
};
</script>

<style scoped>
.content-container {
  display: flex;
  width: 100vw;
  height: calc(100vh - 72px);
}

.places,
.maps {
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
