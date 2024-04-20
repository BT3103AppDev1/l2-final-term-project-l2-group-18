<template>
  <NavBar /> 
  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <h2>Day {{ day }}</h2>
      </div>
      <div class="location-container">
        <div
          class="location-details"
          v-for="item in filteredItineraryData(day)"
          :key="item.locid"
        >
          <div class="location-header">
            <h3>{{ item.location }}</h3>
            <span
              class="location-category"
              :style="{ backgroundColor: getCategoryColor(item.category) }"
            >{{ item.category }}</span>
          </div>
          <span class="location-description">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import NavBar from "../components/NavBar.vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";

export default {
  name: "ItinerariesView",
  components: {
    NavBar
  },
  props: {
    itineraryId: String,
  },
  data() {
    return {
      days: [],
      itineraryData: [],
    };
  },
  mounted() {
    document.body.style.backgroundColor = "#e7dcdc";
    this.fetchData();
  },
  beforeDestroy() {
    document.body.style.backgroundColor = "";
  },
  methods: {
    filteredItineraryData(dayNumber) {
      return this.itineraryData.filter((item) => item.day === dayNumber);
    },

    async fetchData() {
      const db = getFirestore(firebaseApp);
      const daysRef = collection(db, "global_user_itineraries", this.itineraryId, "days");

      try {
        const daysSnapshot = await getDocs(daysRef);
        const structuredData = [];
        const days = [];

        for (const dayDoc of daysSnapshot.docs) {
          const locationsRef = collection(db, "global_user_itineraries", this.itineraryId, "days", dayDoc.id, "locations");
          const locationsSnapshot = await getDocs(locationsRef);
          
          for (const locDoc of locationsSnapshot.docs) {
            const locData = locDoc.data();
            structuredData.push({
              ...locData,
              dayid: dayDoc.id,
              locid: locDoc.id,
            });
          }
          days.push(dayDoc.data().day);
        }

        days.sort((a, b) => a - b);
        this.days = days;
        this.itineraryData = structuredData;
      } catch (error) {
        console.error("Error fetching itinerary data: ", error);
      }
      this.fetchData();
    },

    getCategoryColor(category) {
      // Define colors for different categories
      const categoryColors = {
        Food: "#FF6B6B",
        Bar: "#F28E1C",
        Adventure: "#593233",
        Hotel: "#4E7FE0",
        Nature: "#4EE0A3",
        Sightseeing: "#854DDC",
        Shopping: "#92B1B6",
        "Religious Site": "#DFBD69",
        Others: "#808080",
      };
      // Return the color for the specified category
      return categoryColors[category];
    },
  },
};
</script>

<style scoped>
.places-container {
  padding-left: 3rem;
  padding-right: 3rem;
}

.header-container {
  display: flex;
  align-items: center;
}

h1 {
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.days-container {
  margin-bottom: 1rem;
}

.days-title-container {
  padding-left: 1rem;
  display: flex;
  align-items: center;
}

h2 {
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.location-container {
  padding-left: 2rem;
  align-items: center;
}

.location-details {
  background-color: rgba(128, 128, 128, 0.25);
  border-radius: 10px;
  text-align: left;
  padding: 1rem;
  margin-bottom: 1rem;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 0;
}

.location-category {
  padding: 0.5rem 2rem;
  font-size: 14px;
  border-radius: 10px;
  color: white;
}
</style>