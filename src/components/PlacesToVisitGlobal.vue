<template>
  <!-- <PlacesSearchBar @place-selected="handlePlaceSelection" /> -->
  <div class="title-container">
    <h1>Title: {{ this.title }}</h1>
    <h2>Dates: {{ this.startDate }} - {{ this.endDate }}</h2>
  </div>
  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon icon="calendar" class="fa-regular calendar-icon" :size="iconSize" />
        <h2>Day {{ day }}</h2>
      </div>

      <div class="location-container">
        <div 
        class="location-details" 
        v-for="(item, index) in filteredItineraryData(day)" 
        :key="item.locid"
        draggable="true"
        @dragstart="dragStart($event, index, day)"
        @dragover="dragOver($event, index)"
        @drop="drop($event, index, day)"
        @dragend="dragEnd($event)"
        @dragleave="dragLeave($event)"
        >
          <div class="location-pin"> <!-- New div for the order number and pin icon -->
            <i class="fas fa-map-pin"></i> Stop {{ index + 1 }}
          </div>
          <div class="location-header">
            <h3>{{ item.location }}</h3>
            <div>
              <span class="location-category" :style="{ backgroundColor: getCategoryColor(item.category) }">{{
    item.category }}</span>
            </div>
          </div>
          <span class="location-description">{{ item.description }}</span>
        </div>
      </div>
    </div>

    <div
      class="add-location-form"
      :class="{ open: showAddLocationForm !== null }"
    >
      <AddLocationForm
        @closeForm="showAddLocationForm = null"
        @saveLocation="handleSaveForm"
        v-if="showAddLocationForm !== null"
        :dayNumber="showAddLocationForm"
        :itineraryId="this.itineraryId"
      />
    </div>
  </div>
</template>

<script>
import AddLocationForm from "./AddLocationForm.vue";
import PlacesSearchBar from "./PlacesSearchBar.vue";
import { ref, onMounted } from "vue";
import { firebaseApp, auth } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { faL } from "@fortawesome/free-solid-svg-icons";

const db = getFirestore(firebaseApp);

export default {
  mounted() {
    document.body.style.backgroundColor = "#e7dcdc";
    document.addEventListener("click", this.handleOutsideClick)
    this.fetchData();
  },

  beforeDestroy() {
    // Reset the background color when the component is destroyed
    document.body.style.backgroundColor = "";
    document.removeEventListener("click", this.handleOutsideClick)
  },

  data() {
    return {
      showAddLocationForm: null,
      iconSize: "xl",
      days: [],
      itineraryData: [],
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      showDropdown: false,
      sharingToUser: false, // To manage sharing to specific user
      username: "",
    };
  },
  props: {
    itineraryId: String,
  },

  methods: {
    getCurrentUserId() {
      const auth = getAuth();
      return auth.currentUser ? auth.currentUser.uid : null;
    },
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
        this.imageURL = headerData.imageURL;
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

    handlePlaceSelection(place) {
      this.$emit("place-selected", place);
    },

    handleOutsideClick() {
      this.showDropdown = false;
      this.sharingToUser = false;
    },
  },
  components: {
    AddLocationForm,
    PlacesSearchBar,
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
  font-size: 1.5rem ;
  color: #333; /* Dark grey color for better contrast */
  margin-bottom: 0.5rem; /* Reduce space below the h1 */
}

h2 {
  font-size: 1.2rem; /* Smaller font size for date range */
  color: #666; /* Lighter color for subheading */
  font-weight: normal; /* Less emphasis on the subheading */
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: left;
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

.location-pin {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #aa085e; /* Adjust as needed */
  margin-right: 10px; /* Space between pin icon and location name */
}

.fa-map-pin {
  margin-right: 8px; /* Space between the icon and the number */
}

.location-details {
  background-color: rgba(128, 128, 128, 0.25);
  border-radius: 10px;
  text-align: left;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  font-size: 14px;
  border-radius: 10px;
  color: white;
}

.dropdown-menu {
  background-color: #ffffff;;
  border-radius: 8px;
  padding: 5px;
  width: 240px;
  z-index: 100;
  position: absolute;
  transform: translateX(-87%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.input-group {
  display: flex;
  align-items: center; /* Align vertically */
  width: 100%; /* Ensure the group takes full width */
  padding-bottom: 2px; /* Spacing from the label above */
  margin-bottom: 0px;
}

.title-container {
  padding-left: 3rem;
  margin-top: 0rem;
  text-align: center; /* Center-align the text */
  border-bottom: 1px solid #ccc; /* Add a subtle border */
  padding-bottom: 2px;
}

</style>
