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
        const countriesRef = collection(db, "global_community_itineraries");
        const countriesSnapshot = await getDocs(countriesRef);
        for (const countryDoc of countriesSnapshot.docs) {
          const itinerariesRef = collection(countryDoc.ref, "Itineraries");
          const itinerariesSnapshot = await getDocs(itinerariesRef);
          itinerariesSnapshot.forEach(doc => {
            const data = doc.data();
            const formattedItinerary = {
              id: doc.id,
              title: data.title,
              destination: countryDoc.id, // Assuming the country ID is the document key
              startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString("en-GB"),
              endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString("en-GB"),
              votes: data.votes, // Assuming votes are stored at the itinerary level
              imageURL: data.imageURL
            };
            this.fetchedItineraries.push(formattedItinerary);
          });
        }
        console.log("All itineraries fetched:", this.fetchedItineraries);
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
