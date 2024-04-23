<template>
  <div class="itinerary-container">
    <div v-for="(itinerary, index) in fetchedItineraries" :key="index" class="itinerary-wrapper">
      <CommunityList :type="'Community'" :country="itinerary.destination" class="zoom-effect" />
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
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
      try {
        const itinerariesQuery = query(collection(db, "global_user_itineraries"));
        const querySnapshot = await getDocs(itinerariesQuery);
        querySnapshot.forEach(async (doc) => {
          try {
            const headerData = doc.data();
            const options = { year: "numeric", month: "short", day: "2-digit" };
            const formattedItinerary = {
              title: headerData.title,
              destination: headerData.destination,
              startDate: new Date(headerData.dateRange[0].seconds * 1000).toLocaleDateString("en-GB", options),
              endDate: new Date(headerData.dateRange[1].seconds * 1000).toLocaleDateString("en-GB", options)
            };
            this.fetchedItineraries.push(formattedItinerary);
          } catch (error) {
            console.error(`Error formatting itinerary:`, error);
          }
        });
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    }
  }
};
</script>

<style scoped>
.itinerary-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}


.zoom-effect {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.zoom-effect:hover {
  transform: scale(1.05);
  opacity: 0.8;
}
</style>
