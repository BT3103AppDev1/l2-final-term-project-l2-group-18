<template>
  <NavBar />
  <div class="content-container" v-if="hasPermission">
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
  <div v-else>
    <p class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import GoogleMaps from "../components/GoogleMaps.vue";
import PlacesToVisit from "@/components/PlacesToVisit.vue";
import { doc, setDoc, getDoc, addDoc, getFirestore, collection } from "firebase/firestore";

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
      hasPermission: true, // Indicates if the user has permission
      errorMessage: '' // Store error messages
    };
  },
  methods: {
    // handlePlaceSelection(place) {
    //   this.selectedPlace = place;
    // }

    async checkItineraryPermission() {
      const userId = this.$store.getters['user/userUID'];
      const itineraryRef = doc(getFirestore(), "users", userId, "itineraries", this.itineraryId);

      try {
        const docSnap = await getDoc(itineraryRef);
        if (!docSnap.exists()) {
          this.hasPermission = false;
          this.errorMessage = "You do not have permission to view this itinerary.";
          console.error(this.errorMessage);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        this.errorMessage = "Failed to verify itinerary permissions.";
      }
    },


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
  mounted() {
    this.checkItineraryPermission();
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

.error-message{
  font-size: 40px;
  font-weight: 800;
  text-align: center;
  text-transform: capitalize;
}
</style>

