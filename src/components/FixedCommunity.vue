<template>
  <div class="itinerary-container">
    <div v-for="(itinerary, index) in fetchedItineraries" :key="index" class="itinerary-wrapper">
      <CommunityListNoSearch :type="'Community'" :country="itinerary.destination" :itineraryId="itinerary.id"/>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import CommunityListNoSearch from "./CommunityListNoSearch.vue";

export default {
  components: {
    CommunityListNoSearch
  },
  props: {
    itinerary: Object,
    destination: String,
    startDate: String,
    endDate: String,
    votes: Number,
    imageURL: String
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
              destination: data.destination,
              startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString("en-GB"),
              endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString("en-GB"),
              votes: data.votes,
              imageURL: data.imageURL
            };
            if (!this.fetchedItineraries.some(itinerary => itinerary.id === formattedItinerary.id)) {
              this.fetchedItineraries.push(formattedItinerary);
            }
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
</style>
