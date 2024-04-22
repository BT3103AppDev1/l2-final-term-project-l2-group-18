<template>
  <!-- <PlacesSearchBar @place-selected="handlePlaceSelection" /> -->
  <div class="title-container">
    <h1>Title: {{ this.title }}</h1>
    <h2>Dates: {{ this.startDate }} - {{ this.endDate }}</h2>
  </div>
  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
      <div class="share-button-container">
        <font-awesome-icon
          icon="share-from-square"
          class="share-icon"
          :size="iconSize"
          @click="toggleDropdown"
        />
        <div v-if="showDropdown" class="dropdown-menu" @click.stop>
          <div v-if="!sharingToUser">
            <div @click="enableShareToUser" class="share_buttons"> <font-awesome-icon icon="users" class="share_icons" /> Share with other Users</div>
            <div @click="shareToCommunity" class="share_buttons"> <font-awesome-icon icon="globe" class="share_icons" /> Share with Community</div>
          </div>
          <div v-else>
            <div id="share_users_text">Share with:</div>
            <div class="input_group">
              <input type="text" v-model="username" placeholder="Enter username" @keyup.enter="shareToSpecificUser" id="username_input">
              <button @click="shareToSpecificUser" id="shareWithUsers_button">Share</button>
            </div>
          </div>
        </div>
        <button class="new-day-button" @click="addNewDay">Add New Day</button>
      </div>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon icon="calendar" class="fa-regular calendar-icon" :size="iconSize" />
        <h2>Day {{ day }}</h2>
        <button v-if="index === days.length - 1 && days.length !== 1" class="delete-day-button"
          @click="deleteDay(index)">
          Delete Day
        </button>
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
              <span class="location-category" :style="{ backgroundColor: getCategoryColor(item.category) }">{{item.category }}</span>
              <button class="minus-button" @click="deleteLocation(item.dayid, item.locid)">
                -
              </button>
            </div>
          </div>
          <span class="location-description">{{ item.description }}</span>

          <div v-if="travelTimes[day] && travelTimes[day][index]" class="travel-time" >
            <div id="travel_stop_text">To Stop {{index + 2}}:</div>
            <div class="travel-info-group" id = "dist-loc-group"><i class="fas fa-road travel-time-icon"></i><span>{{ travelTimes[day][index].distance }}</span></div>
            <div class="travel-info-group" id = "car-group"><i class="fas fa-car travel-time-icon"></i><span>{{ travelTimes[day][index].durationDriving }}</span></div>
            <div class="travel-info-group" id = "walk-group"><i class="fas fa-walking travel-time-icon"></i><span>{{ travelTimes[day][index].durationWalking }}</span></div>
            <a :href="travelTimes[day][index].directionsLink" target="_blank" class="directions-link"><i class="fas fa-directions directions-icon-only"></i></a>
          </div>
        </div>
        <div class="add-location-container">
          <button class="plus-button" @click="showAddLocationForm = index + 1">
            +
          </button>
          <span class="add-location">Add Location</span>
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
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { faL } from "@fortawesome/free-solid-svg-icons";
import draggable from "vuedraggable";

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
      // Filter for specific day
      const dayLocations = this.itineraryData.filter((item) => item.day === dayNumber);

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

    async getTravelTime(origin, destination) {  // USED A PROXY here as will get CORS issue so need to modify vite.config.js

      // I set to consider current traffic conditions as well
      const fetchDirections = async (mode) => {
        const directionsUrl = `/api/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&departure_time=now&key=AIzaSyDIFDYXIzGzLEUHwn_y72B2g7qiB2yR1g8`;
      
        try {
          const result = await fetch(directionsUrl);
          const data = await result.json();
          if (data.routes.length > 0) {
            const route = data.routes[0];
            const leg = route.legs[0];
            return {
              distance: leg.distance.text,
              duration: leg.duration.text, // This includes traffic delays
              // directionsLink: `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch directions for mode ${mode}:`, error);
          return { distance: 'N/A', duration: 'N/A' }; // Return "Not Available" if the API call fails
        }
      };

      // Fetch directions for both driving and walking
      const driving = await fetchDirections('driving');
      const walking = await fetchDirections('walking');

      return {
        distance: driving.distance, // Assume distance is the same for both modes
        durationDriving: driving.duration,
        durationWalking: walking.duration,
        directionsLink: `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`,
      };
    },

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
              order: locData.order
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

        this.days.forEach(dayNumber => {
          this.fetchTravelTimesForDay(dayNumber);
        });
        
        // Dispatch the Vuex action to update locations in the store
        this.$store.dispatch('locations/updateLocations', locations);

      } catch (error) {
        console.error("Error fetching itinerary data: ", error);
      }
    },

    dragStart(event, index, day) {
      this.draggingItem = index;
      this.draggingDay = day;
      event.dataTransfer.effectAllowed = 'move';
      event.target.classList.add('dragging'); // Add dragging class
      console.log("Initial Drag", day, index);
    },

    dragOver(event, index) {
      event.preventDefault(); // Necessary to allow dropping
      event.target.classList.add('over'); // Add class when an item is dragged over another
    },

    dragLeave(event) {
      event.target.classList.remove('over'); // Remove class when the dragging item leaves the element
    },

    dragEnd(event) {
      const elements = document.querySelectorAll('.location-details');
      elements.forEach(element => element.classList.remove('dragging'));
    },

    drop(event, index, day) {
      event.preventDefault(); // To ensure custom drop logic can execute
      event.target.classList.remove('over'); // Remove class on drop
      console.log("Final Drag", day, index);

      const itemToMove = this.itineraryData.splice(this.draggingItem, 1)[0];  // Removes the dragged item from the array and store in variable
      this.itineraryData.splice(index, 0, itemToMove);  // removes 0 item and adds itemToMove
      this.updateItineraryData(day, index); // Update Firebase backend
    },

    async updateItineraryData(day, index) {  // Current logic support reordering within same day only
      if (this.draggingDay === day && this.draggingItem != index) {
        const db = getFirestore(firebaseApp);
        const daysRef = collection(db, "global_user_itineraries", this.itineraryId, "days");

        // Fetch the day document
        const querySnapshot = await getDocs(query(daysRef, where("day", "==", day)));

        if (!querySnapshot.empty) {
          const dayDoc = querySnapshot.docs[0]; 
          const locationsRef = collection(dayDoc.ref, "locations");
          const locationsSnapshot = await getDocs(locationsRef);

          let locationsArray = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          locationsArray.sort((a, b) => a.order - b.order); // Sort once before modifications

          const itemToMove = locationsArray.splice(this.draggingItem, 1)[0];  // Removes dragged item from array and store in variable
          locationsArray.splice(index, 0, itemToMove);  // Inserts dragged item back 

          locationsArray = locationsArray.map((loc, idx) => ({ ...loc, order: idx + 1 }));  // Reassigns order number

          try { 
            for (const loc of locationsArray) {
              const locRef = doc(locationsRef, loc.id);
              await updateDoc(locRef, { order: loc.order });
            };
          } catch (error) {
            console.error("Error updating order:", error);
          } finally {
            this.fetchData();
          }
        }  
      } else {
        console.log("IT IS THE SAME DAY OR Multiple Days Drag and Drop not supported yet")
      }
    },

    async addNewDay() {
      this.days.push(this.days.length + 1); // mock data code, can remove once firebase
      // Assumes itineraryId is passed as a prop or can be otherwise obtained
      console.log(this.days[this.days.length - 1]);
      const itineraryId = this.itineraryId;
      const maxDay = this.days[this.days.length - 1];

      try {
        // Construct the document path where the location data will be saved
        const daysRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days"
        );
        await addDoc(daysRef, {
          day: maxDay,
        });
        alert("Day successfully added!");
      } catch (error) {
        console.error("Error adding day: ", error);
      }
      this.fetchData();
    },

    async deleteDay(index) {
      // add code to delete data from firebase with itineraries in the same day
      console.log(index + 1);
      this.days.splice(index, 1);
      const maxDay = index + 1;
      const itineraryId = this.itineraryId;

      try {
        const q = query(
          collection(db, "global_user_itineraries", itineraryId, "days"),
          where("day", "==", maxDay)
        );
        const maxDaySnapshot = await getDocs(q);
        const daysRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days"
        );
        if (!maxDaySnapshot.empty) {
          // Get the document ID of the latest day
          const maxDayDocId = maxDaySnapshot.docs[0].id;

          // Construct the reference to the day's "locations" subcollection
          const locationsRef = collection(
            db,
            "global_user_itineraries",
            itineraryId,
            "days",
            maxDayDocId, // Convert maxDay to string since it's part of the path
            "locations"
          );

          // Query and retrieve all documents from the "locations" subcollection
          const locationsSnapshot = await getDocs(locationsRef);

          // Iterate through each location document and delete it
          locationsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log("Location deleted:", doc.id);
          });

          alert("Latest day successfully deleted!");
          // Delete the latest day document
          await deleteDoc(doc(daysRef, maxDayDocId));
        } else {
          console.log("No days found to delete.");
        }
      } catch (error) {
        console.error("Error deleting day: ", error);
      } finally {
        this.fetchData();
      }
    },

    async deleteLocation(dayid, locid) {
      const itineraryId = this.itineraryId;
      try {
        // Construct the reference to the day's "locations" subcollection
        const locationsRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days",
          dayid,
          "locations"
        );

        // Fetch all locations for the current day to update their order
        const allLocations = await getDocs(locationsRef);
        const locationsArray = allLocations.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Find the order of the location to be deleted
        const locationToDelete = locationsArray.find(loc => loc.id === locid);
        const orderToDelete = locationToDelete.order;

        // Filter out the location to delete and adjust the order of the rest
        const updatedLocations = locationsArray
          .filter(loc => loc.id !== locid)
          .map(loc => {
            if (loc.order > orderToDelete) { // Only decrement order for locations after the one to delete
              loc.order -= 1;
            }
            return loc;
          });

        // Delete the location document
        await deleteDoc(doc(locationsRef, locid));

        // Update the order of remaining locations in firebase
        for (const loc of updatedLocations) {
          const locRef = doc(locationsRef, loc.id);
          await updateDoc(locRef, { order: loc.order });
        };

        alert("Location deleted successfully and order updated!");
      } catch (error) {
        console.error("Error deleting location:", error);
      } finally {
        this.fetchData(); // Refresh the data to reflect the updated order
        console.log("fetched data after deleting location")
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

    handleSaveForm() {
      this.showAddLocationForm = null;
      this.fetchData();
    },

    toggleDropdown(event) {
      event.stopPropagation();
      this.showDropdown = !this.showDropdown;
      console.log("Share Dropdown status: ", this.showDropdown)
    },

    handleOutsideClick() {
      this.showDropdown = false;
      this.sharingToUser = false;
    },

    async shareToCommunity() {
      const userId = this.getCurrentUserId();
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const userItineraryRef = doc(db, "global_user_itineraries", this.itineraryId);
      const userItinerarySnap = await getDoc(userItineraryRef);
      const userItineraryData = userItinerarySnap.data();
      const destinationRef = doc(db, "global_community_itineraries", this.destination);
      const destinationSnap = await getDoc(destinationRef);

      // If the destination does not exist, initialize it.
      if (!destinationSnap.exists()) {
        await setDoc(destinationRef, { imageURL: userItineraryData.imageURL});
      }
      
      const communityItineraryRef = doc(db, "global_community_itineraries", this.destination, "Itineraries", this.itineraryId);
      try {
        await setDoc(communityItineraryRef, {
          ...userItineraryData,
          userId: userId,
          votes: 0
        });
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userVoteRef = doc(communityItineraryRef, "userVotes", userId);
          await setDoc(userVoteRef, {
            voted: false
          });
        }
        const userDaysRef = collection(userItineraryRef, "days");
        const daysSnapshot = await getDocs(userDaysRef);

        for (const dayDoc of daysSnapshot.docs) {
          const dayData = dayDoc.data();
          const dayRef = doc(communityItineraryRef, "days", dayDoc.id);
          await setDoc(dayRef, dayData);
          const userLocationsRef = collection(dayDoc.ref, "locations");
          const locationsSnapshot = await getDocs(userLocationsRef);

          for (const locationDoc of locationsSnapshot.docs) {
            const locationData = locationDoc.data();
            const locationRef = doc(dayRef, "locations", locationDoc.id);
            await setDoc(locationRef, locationData);
          }
        }
        alert("Itinerary shared with the community successfully!");
      } catch (error) {
        console.error("Error sharing itinerary to the community: ", error);
        alert("There was an error sharing the itinerary to the community.");
      }
      this.showDropdown = false;
    },

    enableShareToUser(event) {
      event.stopPropagation();
      this.sharingToUser = true;
    },

    async shareToSpecificUser() {
      if (!this.username) {
        alert("Please enter a username.");
        return;
      }

      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("username", "==", this.username)));

      if (querySnapshot.empty) {
        alert("No user found with that username. Please enter a valid username!!");
        this.username = ''
        return;
      }

      // Iterate through each found user document
      querySnapshot.forEach(async (userDoc) => {
        // Reference to the specific itinerary document under the user's 'itineraries' sub-collection
        const itineraryDocRef = doc(userDoc.ref, "itineraries", this.itineraryId);
        
        // Get the document to check if it exists
        const docSnap = await getDoc(itineraryDocRef);

        if (docSnap.exists()) {
          // Document exists, so the itinerary is already shared
          alert(`This itinerary is already shared with ${userDoc.data().username}!`);
          this.username = '';
          return;
        } else {          
          // Document does not exist, share the itinerary
          await setDoc(itineraryDocRef, {}); // Add an empty object or any data you want to store
          alert(`Your itinerary has been shared with ${userDoc.data().username} successfully!`);
        }
      });

      // Reset dropdown state
      this.sharingToUser = false;
      this.showDropdown = false;
      this.username = ''; // Reset the username input
    }
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

.share-button-container {
  margin-left: auto;
  display: relative;
  align-items: center;
}

.share-icon {
  margin-right: 1rem;
}

.new-day-button {
  width: 120px;
  padding: 0.5rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.delete-day-button {
  width: 100px;
  padding: 0.5rem;
  margin-left: 2rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  border-top: 2px solid #ff5b5b; /* Show a line at the top of the drop target */
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

.minus-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #808080;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
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

.share-icon {
    cursor: pointer;
    margin-left: 10px;  
    color: #646464; 
}

.share-icon:hover {
    color: #0d6efd;  
}

.dropdown-menu {
  background-color: #ffffff;;
  border-radius: 8px;
  padding: 1px;
  width: 240px;
  z-index: 100;
  position: absolute;
  transform: translateX(-87%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dropdown-menu div {
  padding: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #d5cece; /* Separator */
  font-family: 'Arial', sans-serif; /* Use a standard font for clarity */
}

/* Remove border from the last div */
.dropdown-menu div:last-child {
  border-bottom: none;
}

.share_buttons:hover {
  background-color: #0d6efd;
  color: white;
  border-radius: 5px;
}

.share_icons {
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
  font-family: 'Arial', sans-serif; /* Use a standard font for clarity */
  cursor:auto;
}

#shareWithUsers_button {
  padding: 8px 12px;
  background-color: #4A90E2; /* A pleasant blue */
  color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: -10px;
  cursor: pointer;
}

#shareWithUsers_button:hover {
  background-color: #357ABD; /* A pleasant blue */
}

.title-container {
  padding-left: 3rem;
  margin-top: 0rem;
  text-align: center; /* Center-align the text */
  border-bottom: 1px solid #ccc; /* Add a subtle border */
  padding-bottom: 2px;
}

.dragging {
  opacity: 0.75; /* Make the dragging item slightly transparent */
  box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Add shadow for depth */
  transform: scale(1.05); /* Slightly increase the size */
  border: 1px solid #666; /* Add a border to highlight */
}

.travel-time {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(231, 220, 220, 0.9); /* Light gray with transparency */
  background-image: linear-gradient(45deg, rgba(201, 232, 225, 0.2) 25%, transparent 25%, transparent 50%, rgba(201, 232, 225, 0.2) 50%, rgba(201, 232, 225, 0.2) 75%, transparent 75%, transparent); /* Adding stripes */
  background-size: 50px 50px; /* Size of the stripes */
  color: #333;
  font-size: 0.85rem;
  padding: 8px;
  padding-bottom: 5px;
  border-radius: 10px;
  padding-top: 15px ;
  padding-bottom: 15px ;
  margin-top: 15px ;
  cursor: auto;
  margin-bottom: -32px;
  margin-left: -17px;
  margin-right: -17px;
  border: 1px dashed #FF5A5F;
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

.directions-link {
  background-color: #5a9ae3; /* Thematic blue */
  color: white;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.85rem;
  align-items: center;
}

.directions-link:hover {
  background-color: #357ABD; /* Darker blue on hover */
}

.fa {
  align-self: center;
}

#dist-loc-group, #car-group, #walk-group {
  margin-right: 25px;
}

#travel_stop_text {
  margin-right: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  align-items: center;
}

</style>
