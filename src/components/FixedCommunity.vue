<template>
  <div class="itinerary-container">
    <div v-for="(country) in fetchedCountries" :key="index" class="itinerary-wrapper">
      <CommunityListNoSearch :type="'Community'" :country="country.id"/>
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
      fetchedCountries: []
    };
  },
  async mounted() {
    await this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      const db = getFirestore(firebaseApp);
      try {
        const countriesRef = collection(db, "global_community_itineraries");
        const countriesSnapshot = await getDocs(countriesRef);
        const countryList = []; // Array to hold country data for display

        for (const countryDoc of countriesSnapshot.docs) {
          const data = countryDoc.data();
          const countryData = {
            id: countryDoc.id,
            name: data.name, // Assuming each country document has a 'name' field
            imageURL: data.imageURL, // Assuming there's an image URL for each country
            itineraryCount: data.itineraryCount // Assuming a count of itineraries is stored
          };

          console.log("Adding", countryData);
          countryList.push(countryData);
        }

        this.fetchedCountries = countryList; // Update the component's data property
        this.fetchedCountries.forEach(country => console.log(country));
      } catch (error) {
        console.error("Error fetching countries:", error);
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
