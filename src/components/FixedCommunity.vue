<template>
  <div class="itinerary-container">
    <div v-for="(itinerary, index) in fetchedItineraries" :key="index" class="itinerary-wrapper">
      <CommunityList :type="'Community'" :country="itinerary.destination" class="zoom-effect" />
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { firebaseApp, auth } from "../firebaseConfig";
import CommunityList from "./CommunityList.vue";

export default {
  components: {
    CommunityList
  },
  data() {
    return {
      fetchedItineraries: []
    };
  },
  async mounted() {
    await this.fetchItineraries();
  },
  methods: {
    async fetchItineraries() {
      const db = getFirestore(firebaseApp);
      const itineraries = [
        { id: "9L4qniPLcYxXRyVRF90f", country: "Boston" },
        { id: "xxiI5NW2RDhuBETAaVqR", country: "Germany" },
        { id: "3UMHA5ocWf1XnaCncZxt", country: "Hawaii" },
        { id: "LaXElUbPvmqQuoSLkb3g", country: "Japan" }
      ];

      for (const itinerary of itineraries) {
        const itineraryRef = doc(db, "global_user_itineraries", itinerary.id);
        try {
          const itineraryDocSnap = await getDoc(itineraryRef);
          const headerData = itineraryDocSnap.data();
          const options = { year: "numeric", month: "short", day: "2-digit" };
          const formattedItinerary = {
            title: headerData.title,
            destination: headerData.destination,
            startDate: new Date(headerData.dateRange[0].seconds * 1000).toLocaleDateString("en-GB", options),
            endDate: new Date(headerData.dateRange[1].seconds * 1000).toLocaleDateString("en-GB", options)
          };
          this.fetchedItineraries.push(formattedItinerary);
        } catch (error) {
          console.error(`Error fetching itinerary for ${itinerary.country}:`, error);
        }
      }
    }
  }
};
</script>

<style scoped>
.itinerary-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-left: 100px;
}

.itinerary-wrapper {
  margin: 10px;
}

.zoom-effect {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.zoom-effect:hover {
  transform: scale(1.05);
  opacity: 0.8;
}
</style>
