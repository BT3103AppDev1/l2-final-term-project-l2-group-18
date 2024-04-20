<template>
  <div class="title-container">
    <h1>Title: {{ title }}</h1>
    <h2>Dates: {{ startDate }} - {{ endDate }}</h2>
  </div>
  <div class="places-container">
    <h1>Places to Visit</h1>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon icon="calendar" class="fa-regular calendar-icon" :size="iconSize" />
        <h2>Day {{ day }}</h2>
      </div>
      <div class="location-container">
        <div class="location-details" v-for="item in filteredItineraryData(day)" :key="item.id">
          <h3>{{ item.location }}</h3>
          <span class="location-category" :style="{ backgroundColor: getCategoryColor(item.category) }">
            {{ item.category }}
          </span>
          <span class="location-description">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";

export default {
  props: {
    itineraryId: String,
  },
  data() {
    return {
      iconSize: "xl",
      days: [],
      itineraryData: [],
      title: "",
      startDate: "",
      endDate: "",
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    filteredItineraryData(dayNumber) {
      return this.itineraryData.filter((item) => item.day === dayNumber);
    },
    async fetchData() {
      const db = getFirestore(firebaseApp);
      // Assumes itineraryId is passed as a prop or can be otherwise obtained
      const itineraryId = this.itineraryId;
      const daysRef = collection(
        db,
        "global_user_itineraries",
        itineraryId,
        "days"
      );

      try {
        // Fetch Title, Start date, End date
        const itineraryDocRef = doc(
          getFirestore(),
          "global_user_itineraries",
          this.itineraryId
        );
        const itineraryDocSnap = await getDoc(itineraryDocRef);
        const headerData = itineraryDocSnap.data();
        const options = { year: "numeric", month: "short", day: "2-digit" };
        this.title = headerData.title;
        this.destination = headerData.destination;
        this.startDate = new Date(
          headerData.dateRange[0].seconds * 1000
        ).toLocaleDateString("en-GB", options);
        this.endDate = new Date(
          headerData.dateRange[1].seconds * 1000
        ).toLocaleDateString("en-GB", options);

        // Fetch all days for the given itinerary
        const daysSnapshot = await getDocs(daysRef);

        // Initialize empty arrays to hold structured itinerary data and days
        const structuredData = [];
        const days = [];
        const locations = []; // Collect all locations to update the Vuex store

        // Iterate through each day document
        for (const dayDoc of daysSnapshot.docs) {
          // Fetch all locations for the current day
          const locationsRef = collection(
            db,
            "global_user_itineraries",
            itineraryId,
            "days",
            dayDoc.id,
            "locations"
          );
          const locationsSnapshot = await getDocs(locationsRef);
          // Iterate through each day document
          for (const locDoc of locationsSnapshot.docs) {
            // Extract location data from each location document
            const locData = locDoc.data();
            // Construct the object with additional fields (dayid and locid)
            const locWithIds = {
              dayid: dayDoc.id,
              locid: locDoc.id,
              category: locData.category,
              day: locData.day,
              description: locData.description,
              location: locData.location,
              latitude: locData.latitude,
              longitude: locData.longitude,
            };
            // Push the modified data to the structuredData array
            structuredData.push(locWithIds);
            locations.push(locData);
          }
          // Extract the day value from the document data
          const dayValue = dayDoc.data().day;
          days.push(dayValue);
        }
        // Sort days
        days.sort((a, b) => a - b);
        
        // Set the fetched days to days
        this.days = days;
        console.log(structuredData);
        
        // Set the fetched data to itineraryData
        this.itineraryData = structuredData;
       
        // Dispatch the Vuex action to update locations in the store
        this.$store.dispatch('locations/updateLocations', locations);

      } catch (error) {
        console.error("Error fetching itinerary data: ", error);
      }
    },
    getCategoryColor(category) {
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
      return categoryColors[category] || "#808080";
    },
  },
};
</script>

<style scoped>
.title-container {
  padding-left: 3rem;
  margin-top: 0rem;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 2px;
}

.places-container {
  padding-left: 3rem;
  padding-right: 3rem;
}

.days-container {
  margin-bottom: 1rem;
}

.days-title-container {
  padding-left: 1rem;
  display: flex;
  align-items: center;
}

.calendar-icon {
  margin-right: 1rem;
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

.location-category {
  padding: 0.5rem 2rem;
  font-size: 14px;
  border-radius: 10px;
  color: white;
  display: inline-block;
}

.location-description {
  display: block;
  margin-top: 10px;
}
</style>
