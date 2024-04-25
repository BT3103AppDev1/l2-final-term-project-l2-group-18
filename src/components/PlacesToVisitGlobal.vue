<template>
  <div class="title-container">
    <div class="title-text-container">
      <h1>Title: {{ this.title }}</h1>
      <h2>Dates: {{ this.startDate }} - {{ this.endDate }}</h2>
    </div>
  </div>

  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon
          icon="calendar"
          class="fa-regular calendar-icon"
          :size="iconSize"
        />
        <h2>Day {{ day }}</h2>
      </div>

      <div class="location-container">
        <div
          class="location-details"
          v-for="(item, index) in filteredItineraryData(day)"
          :key="item.locid"
          @click="locationClicked(item)"
        >
          <div class="location-pin">
            <!-- New div for the order number and pin icon -->
            <i class="fas fa-map-pin"></i> Stop {{ index + 1 }}
          </div>
          <div class="location-header">
            <h3>{{ item.location }}</h3>
            <div>
              <span
                class="location-category"
                :style="{ backgroundColor: getCategoryColor(item.category) }"
                >{{ item.category }}</span
              >
            </div>
          </div>
          <span class="location-description">{{ item.description }}</span>

          <div
            v-if="travelTimes[day] && travelTimes[day][index]"
            class="travel-time"
            @click.stop="
              emitRoute(
                travelTimes[day][index].originLat,
                travelTimes[day][index].originLng,
                travelTimes[day][index].DestinationLat,
                travelTimes[day][index].DestinationLng
              )
            "
          >
            <div id="travel_stop_text">To Stop {{ index + 2 }}:</div>
            <div class="travel-info-group" id="dist-loc-group">
              <i class="fas fa-road travel-time-icon" id="road_icon_travel"></i
              ><span>{{ travelTimes[day][index].distance }}</span>
            </div>
            <div class="travel-info-group" id="car-group">
              <i class="fas fa-car travel-time-icon" id="car_icon_travel"></i
              ><span>{{ travelTimes[day][index].durationDriving }}</span>
            </div>
            <div class="travel-info-group" id="walk-group">
              <i class="fas fa-walking travel-time-icon" id="walk_icon_travel"></i
              ><span>{{ travelTimes[day][index].durationWalking }}</span>
            </div>
            <a
              :href="travelTimes[day][index].directionsLink"
              target="_blank"
              class="directions-link"
              ><i class="fas fa-directions directions-icon-only"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import AddLocationForm from "./AddLocationForm.vue";
import ChangeLocationForm from "./ChangeLocationForm.vue";
import PlacesSearchBar from "./PlacesSearchBar.vue";
import { ref, onMounted } from "vue";
import { firebaseApp, auth } from "../firebaseConfig";
import axios from 'axios';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { faL } from "@fortawesome/free-solid-svg-icons";
import draggable from "vuedraggable";

const db = getFirestore(firebaseApp);

export default {
  mounted() {
    this.fetchData(); // Restored
    document.body.style.backgroundColor = "#e7dcdc";
    document.addEventListener("click", this.handleOutsideClick);
    this.setupRealTimeListener();
  },

  beforeDestroy() {
    // Reset the background color when the component is destroyed
    document.body.style.backgroundColor = "";
    document.removeEventListener("click", this.handleOutsideClick);
  },

  data() {
    return {
      showAddLocationForm: null,
      showChangeLocationForm: false,
      selectedLocation: {},
      iconSize: "xl",
      smallIconSize: "sm",
      days: [],
      itineraryData: [],
      sourceDayArray: [],
      targetDayArray: [],
      travelTimes: {}, // Stores travel times for each day
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      showDropdown: false,
      sharingToUser: false, // To manage sharing to specific user
      username: "",
      draggingItem: null,
      draggingDay: null,
      showDropdownEditTitle: false,
      edittingTitle: false,
      edittingDateRange: false,
      edittingDescription: false,
      new_title: "",
      new_dateRange: [new Date(), new Date()],
      new_description: "",
    };
  },
  props: {
    itineraryId: String,
  },

  emits: ['route-requested', "destination-updated"],

  methods: {
    getCurrentUserId() {
      const auth = getAuth();
      return auth.currentUser ? auth.currentUser.uid : null;
    },

    filteredItineraryData(dayNumber) {
      // Filter for specific day
      const dayLocations = this.itineraryData.filter(
        (item) => item.day === dayNumber
      );

      // Sort the locations by the 'order' attribute
      dayLocations.sort((a, b) => a.order - b.order);

      // Return the sorted locations
      return dayLocations;
    },

    async fetchTravelTimesForDay(dayNumber) {
      const locations = this.filteredItineraryData(dayNumber);
      let times = [];

      for (let i = 0; i < locations.length - 1; i++) {
        const origin = locations[i];
        const destination = locations[i + 1];
        const time = await this.getTravelTime(origin, destination);
        times.push(time);
      }

      this.travelTimes[dayNumber] = times;
    },

    async getTravelTime(origin, destination) {
      axios.defaults.baseURL = "https://fierce-sands-18810-300a8a84ddec.herokuapp.com";

      const fetchDirections = async (mode) => {
        const directionsUrl = `/api/directions?originLat=${origin.latitude}&originLng=${origin.longitude}&destLat=${destination.latitude}&destLng=${destination.longitude}&mode=${mode}`;

        try {
          const result = await axios.get(directionsUrl);
          const data = result.data;
          if (data.routes.length > 0) {
            const route = data.routes[0];
            const leg = route.legs[0];
            return {
              distance: leg.distance.text,
              duration: leg.duration.text, // This includes traffic delays
            };
          }
        } catch (error) {
          console.error(`Failed to fetch directions for mode ${mode}:`, error);
          return { distance: "N/A", duration: "N/A" }; // Return "Not Available" if the API call fails
        }
      };

      // Fetch directions for both driving and walking
      const driving = await fetchDirections("driving");
      const walking = await fetchDirections("walking");

      if (driving && walking) {
        return {
          distance: driving.distance, // Assume distance is the same for both modes
          durationDriving: driving.duration,
          durationWalking: walking.duration,
          directionsLink: `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`,
          originLat: origin.latitude,
          originLng: origin.longitude,
          DestinationLat: destination.latitude,
          DestinationLng: destination.longitude,
        };
      } else {
        return  { distance: "N/A", durationDriving: "N/A", durationWalking: "N/A"};
      }
    },

    emitRoute(originLat, originLng, destLat, destLng) {
      this.$emit("route-requested", { originLat, originLng, destLat, destLng });
    },

    // Deprecated
    async fetchData() {
      // Reset travelTimes
      this.travelTimes = {};

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
        this.$emit('destination-updated', this.destination); // Emit to Parent
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
              order: locData.order,
              placeId: locData.placeId,
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

        // Set the fetched data to itineraryData
        this.itineraryData = structuredData;

        this.days.forEach((dayNumber) => {
          this.fetchTravelTimesForDay(dayNumber);
        });

        // Dispatch the Vuex action to update locations in the store
        this.$store.dispatch("locations/updateLocations", locations);
      } catch (error) {
        console.error("Error fetching itinerary data: ", error);
      }
    },

    setupRealTimeListener() {
      const itineraryId = this.itineraryId;
      const db = getFirestore(firebaseApp);

      // Listening to changes in the itinerary header
      const itineraryDocRef = doc(db, "global_user_itineraries", itineraryId);
      onSnapshot(itineraryDocRef, (doc) => {
        const data = doc.data();
        const options = { year: "numeric", month: "short", day: "2-digit" };
        this.title = data.title;
        this.destination = data.destination;
        this.$emit('destination-updated', this.destination);
        this.imageURL = data.imageURL;
        this.startDate = new Date(data.dateRange[0].seconds * 1000).toLocaleDateString("en-GB", options);
        this.endDate = new Date(data.dateRange[1].seconds * 1000).toLocaleDateString("en-GB", options);
      });

      // Listening to changes in the days and locations
      const daysRef = collection(db, "global_user_itineraries", itineraryId, "days");
      onSnapshot(daysRef, (snapshot) => {
        let newDays = [];
        snapshot.forEach((dayDoc) => {
          const dayNumber = dayDoc.data().day;
          newDays.push(dayNumber);

          // Listen to changes in locations under each day
          const locationsRef = collection(db, "global_user_itineraries", itineraryId, "days", dayDoc.id, "locations");
          onSnapshot(locationsRef, (locSnapshot) => {
            let locations = this.itineraryData.filter(loc => loc.dayid !== dayDoc.id); // Clear previous day's locations
            locSnapshot.forEach((locDoc) => {
              const locData = locDoc.data();
              locations.push({
                ...locData,
                dayid: dayDoc.id,
                locid: locDoc.id,
                latitude: locData.latitude,
                longitude: locData.longitude,
                order: locData.order
              });
            });
            this.itineraryData = locations;
            this.fetchTravelTimesForDay(dayNumber); // Double check if functioning
          });
        });
        this.days = newDays.sort((a, b) => a - b);
      });
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

    handleSaveForm() {
      this.showAddLocationForm = null;
      this.fetchData();
    },

    handleChangeDetailsForm(locid) {
      this.showChangeLocationForm = false;
      this.fetchData();
    },

    toggleDropdown(event) {
      event.stopPropagation();
      this.showDropdown = !this.showDropdown;

      if (this.sharingToUser = true) {
        this.sharingToUser = !this.sharingToUser;
      }
      console.log("Share Dropdown status: ", this.showDropdown);
    },

    locationClicked(location) {
      this.$store.dispatch('locations/selectLocation', location);
      console.log(location, " dispatched")
  },

    handleOutsideClick() {
      this.showDropdownEditTitle = false;
      this.edittingTitle = false;
      this.edittingDateRange = false;
      this.showDropdown = false;
      this.sharingToUser = false;
    },
  },

  components: {
    AddLocationForm,
    ChangeLocationForm,
    PlacesSearchBar,
    Datepicker,
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
  font-size: 1.5rem;
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

.share-button-container {
  margin-left: auto;
  display: relative;
  align-items: center;
}

.new-day-button {
  width: 120px;
  padding: 0.5rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
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
  color: #FF7F50;
}

.delete-day-button {
  width: 100px;
  padding: 0.5rem;
  margin-left: 2rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.new-day-button:hover, .delete-day-button:hover {
  transform: scale(1.05);
  background-color: #e53e3e; /* Adjust the color to fit the theme */
}

.location-container {
  padding-left: 0.5rem;
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

.location-details.over {
  border-top: 10px solid #ff5b5b; /* Show a line at the top of the drop target */
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

.trash-icon {
  cursor: pointer;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  color: #646464;
}

.trash-icon:hover {
  color: #0d6efd;
}

.pencil-icon {
  cursor: pointer;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  color: #646464;
}

.pencil-icon:hover {
  color: #0d6efd;
}

.add-location-container {
  padding-left: 2rem;
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.plus-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
}

.add-location {
  color: #808080;
}

.add-location-form {
  position: fixed;
  top: 4.3rem;
  left: -50%;
  /* Sidebar starts off-screen */
  width: 50%;
  height: 100%;
  background-color: #fff;
  transition: left 0.3s ease;
  /* Transition effect */
  z-index: 1000;
  /* Ensure sidebar is above other content */
}

.add-location-form.open {
  left: 0;
  /* Slide sidebar into view */
}

.share_icon_overall {
  cursor: pointer;
  margin-left: 10px;
  color: #646464;
  margin-right: 1rem;
}

.share_icon_overall:hover {
  color: #0d6efd;
}

.dropdown-menu {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1px;
  width: 240px;
  z-index: 100;
  position: absolute;
  transform: translateX(-87%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu div {
  padding: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #d5cece; /* Separator */
  font-family: "Arial", sans-serif; /* Use a standard font for clarity */
}

/* Remove border from the last div */
.dropdown-menu div:last-child {
  border-bottom: none;
}

.share_buttons_options_to_choose:hover {
  background-color: #0d6efd;
  color: white;
  border-radius: 5px;
}

.share_icons_logos_used_from_lib {
  cursor: pointer;
  margin-right: 5px;
}

.input-group {
  display: flex;
  align-items: center; /* Align vertically */
  width: 100%; /* Ensure the group takes full width */
  padding-bottom: 2px; /* Spacing from the label above */
  margin-bottom: 0px;
}

#username_input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px; /* Rounded corners on the left side only */
  margin-right: -2px; /* Overlap border with button */
  position: 50%;
}

#share_users_text {
  border-bottom: none;
  padding: 0px;
  font-family: "Arial", sans-serif; /* Use a standard font for clarity */
  cursor: auto;
}

#shareWithUsers_button {
  padding: 8px 12px;
  background-color: #4a90e2; /* A pleasant blue */
  color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: -10px;
  cursor: pointer;
}

#shareWithUsers_button:hover {
  background-color: #357abd; /* A pleasant blue */
}

#user-share-icon {
  color: #9f7305
}

#community-share-icon {
  color: #430ca9
}

.dragging {
  opacity: 0.75; /* Make the dragging item slightly transparent */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
  transform: scale(1.05); /* Slightly increase the size */
  border: 1px solid #666; /* Add a border to highlight */
}

.travel-time {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(231, 220, 220, 0.9); /* Light gray with transparency */
  background-image: linear-gradient(
    45deg,
    rgba(201, 232, 225, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(201, 232, 225, 0.2) 50%,
    rgba(201, 232, 225, 0.2) 75%,
    transparent 75%,
    transparent
  ); /* Adding stripes */
  background-size: 50px 50px; /* Size of the stripes */
  color: #333;
  font-size: 0.85rem;
  padding: 8px;
  padding-bottom: 5px;
  border-radius: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 15px;
  cursor: auto;
  margin-bottom: -32px;
  margin-left: -17px;
  margin-right: -17px;
  border: 1px dashed #ff5a5f;
}

.travel-info-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.travel-time-icon {
  width: 18px;
  margin-right: 5px;
  padding: 5px;
  align-items: center;
}

#road_icon_travel {
  color: #765c0c;
}

#walk_icon_travel {
  color: #ff6347;
}

#car_icon_travel {
  color: #4a90e2;
}

.directions-link {
  background-color: #4CAF50; 
  color: white;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.85rem;
  align-items: center;
}

.directions-link:hover {
  background-color: #388E3C; 
}

.fa {
  align-self: center;
}

#dist-loc-group,
#car-group,
#walk-group {
  margin-right: 25px;
}

#travel_stop_text {
  margin-right: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  align-items: center;
}

.title-container {
  padding-left: 3rem;
  padding-right: 2rem;
  margin-top: 0rem;
  text-align: center; /* Center-align the text */
  border-bottom: 1px solid #ccc; /* Add a subtle border */
  padding-bottom: 2px;
  display: flex;
  justify-content: space-between;
}

.edit-icon {
  cursor: pointer;
  margin-top: 0.5rem;
  color: #646464;
}

.edit-icon:hover {
  color: #0d6efd;
}

.dropdown-edit-menu {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.5px;
  width: 330px;
  z-index: 100;
  position: absolute;
  transform: translateX(-75%);
  margin-top: 0.3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-edit-menu div {
  padding: 3px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #d5cece; /* Separator */
  font-family: "Arial", sans-serif; /* Use a standard font for clarity */
}

/* Remove border from the last div */
.dropdown-edit-menu div:last-child {
  border-bottom: none;
}

.edit_buttons:hover {
  background-color: #0d6efd;
  color: white;
  border-radius: 5px;
}

.edit_icons {
  cursor: pointer;
  margin-right: 5px;
}

.input_group_1, .input_group_2  {
  display: flex;
  align-items: center; /* Align vertically */
  width: 100%; /* Ensure the group takes full width */
  padding-bottom: 2px; /* Spacing from the label above */
  margin-bottom: 0px;
  margin-right: 0px;
}

#new_title_input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px; /* Rounded corners on the left side only */
  margin-right: -2px; /* Overlap border with button */
  position: 50%;
  display: flex;
}

#edit_text {
  border-bottom: none;
  padding: 0px;
  font-family: "Arial", sans-serif; /* Use a standard font for clarity */
  cursor: auto;
}

#confirm_button {
  padding: 9px 12px;
  background-color: #4a90e2; /* A pleasant blue */
  color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: -10px;
  cursor: pointer;
}

#confirm_button:hover {
  background-color: #357abd; /* A pleasant blue */
}

#edit_dates {
  border-bottom: none;
  padding: 0px ;
  font-family: "Arial", sans-serif; /* Use a standard font for clarity */
  cursor: auto;
  width: 100%;
  margin-bottom: -5px;
}

#dates_input {
  flex-grow: 1; /* Ensure it expands to fill space */
  padding: 2px 0px;
  border-radius: 4px; /* Uniform border-radius */
  border-bottom: 0px;
  margin-right: 10px; /* Add some space between the input and the button */
}

.vue-datepicker-ui .datepicker-date {
  font-size: 10px !important; /* As an example of using !important */
}

.delete-icon {
  cursor: pointer;
  margin-left: 10px; /* Space from the edit icon */
  color: #0b7407; /* Use a color that signifies a delete action, like a red tone */
}

.delete-icon:hover {
  color: #FF4500; /* Darker tone on hover */
}

.location-description {
    white-space: pre-wrap;
}


</style>
