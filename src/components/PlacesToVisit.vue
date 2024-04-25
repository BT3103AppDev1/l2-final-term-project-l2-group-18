<template>
  <div class="title-container">
    <div class="title-text-container">
      <h1>Title: {{ this.title }}</h1>
      <h2>Dates: {{ this.startDate }} - {{ this.endDate }}</h2>
    </div>

    <div class="edit-title-button-container">
      <font-awesome-icon
        icon="edit"
        class="edit-icon"
        :size="iconSize"
        @click="toggleDropdownEditTitle"
      />
      <font-awesome-icon
        icon="trash"
        class="delete-icon"
        :size="iconSize"
        @click="confirmDeleteItinerary"
      />
      <div v-if="showDropdownEditTitle" class="dropdown-edit-menu" @click.stop :style="{ width: edittingDateRange ? '350px' : (edittingTitle ? '300px' : '180px') }">
        <div v-if="!edittingTitle && !edittingDateRange">
          <div @click="editTitle" class="edit_buttons">
            <font-awesome-icon icon="file" class="edit_icons" /> Edit Title
          </div>
          <div @click="editDateRange" class="edit_buttons">
            <font-awesome-icon icon="calendar" class="edit_icons" /> Edit Date
            Range
          </div>
        </div>
        <div v-else-if="edittingTitle">
          <div id="edit_text">Enter New Title:</div>
          <div class="input_group_1">
            <input
              type="text"
              v-model="new_title"
              placeholder="Enter Title"
              @keyup.enter="changeTitle(new_title)"
              id="new_title_input"
            />
            <button @click="changeTitle(new_title)" id="confirm_button">
              Confirm
            </button>
          </div>
        </div>
        <div v-else-if="edittingDateRange">
          <div id="edit_dates">Choose new dates</div>
          <div class="input_group_2">
            <Datepicker id = "dates_input"
                v-model="new_dateRange"
                format="dd/MM/yyyy"
                placeholder="Pick a Date"
                range
              />
            <button @click="changeDateRange(new_dateRange)" id="confirm_button">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
      <div class="share-button-container">
        <font-awesome-icon
          icon="fa-share-alt"
          class="share_icon_overall"
          :size="iconSize"
          @click="toggleDropdown"
        />
        <div v-if="showDropdown" class="dropdown-menu" @click.stop>
          <div v-if="!sharingToUser">
            <div @click="enableShareToUser" class="share_buttons_options_to_choose">
              <font-awesome-icon icon="users" class="share_icons_logos_used_from_lib" id="user-share-icon"/> Share with
              other Users
            </div>
            <div @click="shareToCommunity" class="share_buttons_options_to_choose">
              <font-awesome-icon icon="globe" class="share_icons_logos_used_from_lib" id="community-share-icon"/> Share with
              Community
            </div>
          </div>
          <div v-else>
            <div id="share_users_text">Share with:</div>
            <div class="input_group">
              <input
                type="text"
                v-model="username"
                placeholder="Enter username"
                @keyup.enter="shareToSpecificUser"
                id="username_input"
              />
              <button @click="shareToSpecificUser" id="shareWithUsers_button">
                Share
              </button>
            </div>
          </div>
        </div>
        <button class="new-day-button" @click="addNewDay">Add New Day</button>
      </div>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon
          icon="calendar"
          class="fa-regular calendar-icon"
          :size="iconSize"
        />
        <h2>Day {{ day }}</h2>
        <button
          v-if="index === days.length - 1 && days.length !== 1"
          class="delete-day-button"
          @click="deleteDay(index)"
        >
          Delete Day
        </button>
      </div>

      <div class="location-container">
        <div
          class="add-location-form"
          :class="{
            open: showChangeLocationForm,
          }"
        >
          <ChangeLocationForm
            @closeForm="showChangeLocationForm = false"
            @saveLocation="handleChangeDetailsForm"
            v-if="showChangeLocationForm"
            :item="this.selectedLocation"
            :itineraryId="this.itineraryId"
          />
        </div>
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
              <font-awesome-icon
                icon="pencil"
                class="pencil-icon"
                :size="smallIconSize"
                @click="
                  this.selectedLocation = item;
                  showChangeLocationForm = true;
                "
              />
              <font-awesome-icon
                icon="trash"
                class="trash-icon"
                :size="smallIconSize"
                @click.stop="deleteLocation(item.dayid, item.locid)"
              />
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

    confirmDeleteItinerary() {
    if (confirm("Are you sure you want to delete this itinerary? \n This action cannot be undone.")) {
      this.deleteItinerary();
      }
    },

    async deleteItinerary() {
      try {
        console.log("ID", this.itineraryId)
        await this.deleteItineraryFromFirestore(this.itineraryId);
        this.$router.push({ name: 'MyItineraries' }); // Redirect to itineraries page
        alert("Itinerary deleted successfully.");
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        alert("Error! Failed to delete this itinerary.");
      }
    },

    async deleteItineraryFromFirestore(itineraryId) {
      const db = getFirestore(firebaseApp);
      const batch = writeBatch(db);
      let destination = "";
      let in_community = false;

      try {
        // *********    Delete from global_user_itineraries first       ***********
        const itineraryRef = doc(db, "global_user_itineraries", itineraryId);
        const itineraryData = (await getDoc(itineraryRef)).data();
        destination = itineraryData.destination;

        // Get all days associated with this itinerary
        const daysRef = collection(itineraryRef, "days");
        const daysSnapshot = await getDocs(daysRef);

        // Iterate over each day and delete all locations within it
        for (const dayDoc of daysSnapshot.docs) {
          console.log("Each Day Document:", dayDoc.id);

          // Reference to the locations subcollection for each day
          const locationsRef = collection(dayDoc.ref, "locations");
          const locationsSnapshot = await getDocs(locationsRef);

          // Add each location document to the batch for deletion
          locationsSnapshot.forEach(locDoc => {
            console.log("Each day location:", locDoc.id);
            batch.delete(locDoc.ref); // Schedule each location for deletion
          });

          // Also schedule the day document for deletion
          batch.delete(dayDoc.ref);
        }

        // Finally, schedule the deletion of the itinerary document itself
        batch.delete(itineraryRef);
        console.log("Itinerary and all related data deleted successfully for global_user itineraries");

        // *********    Delete from users collection now ***********
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        for (const userDoc of usersSnapshot.docs) {   // Loop through each user id document
          const userItinerariesRef = collection(userDoc.ref, "itineraries");
          const userItinerariesSnapshot = await getDocs(userItinerariesRef);

          for (const userItineraryDoc of userItinerariesSnapshot.docs) {
            if (userItineraryDoc.id === itineraryId) {
              batch.delete(userItineraryDoc.ref); // Delete this reference if it matches
            }
          }
        }
        console.log("Itinerary and all related data deleted successfully for all users who have access originally")

        // *********    Delete from community collection now ***********
        // Check if the destination country document exists
        console.log(destination)
        const countryRef = doc(db, "global_community_itineraries", destination);
        const countryDoc = await getDoc(countryRef);
        console.log(countryDoc)

        if (countryDoc.exists()) {
          const communityItinerariesRef = collection(countryRef, "Itineraries");
          const specificItineraryRef = doc(communityItinerariesRef, itineraryId);
          const exists = (await getDoc(specificItineraryRef)).exists();

          if (exists) {
            in_community = true;
            const daysRef = collection(specificItineraryRef, "days");
            const daysSnapshot = await getDocs(daysRef);

            for (const dayDoc of daysSnapshot.docs) {
              const locationsRef = collection(dayDoc.ref, "locations");
              const locationsSnapshot = await getDocs(locationsRef);
              locationsSnapshot.forEach(locationDoc => {
                batch.delete(locationDoc.ref);
              });
              batch.delete(dayDoc.ref);
            }

            const userVotesRef = collection(specificItineraryRef, "userVotes");
            const votesSnapshot = await getDocs(userVotesRef);
            votesSnapshot.forEach(voteDoc => {
              batch.delete(voteDoc.ref);
            });

            // Delete the specific itinerary document
            batch.delete(specificItineraryRef);

            
            const remainingItineraries = await getDocs(communityItinerariesRef);
            if (remainingItineraries.empty) {
              // If no other itineraries, delete the country document
              batch.delete(countryRef);
            }
          }
        }
        console.log("Itinerary and all related data deleted successfully for community");
        // Commit the batch
        await batch.commit();
      } catch (error) {
        console.error("Error during itinerary deletion: ", error)
      } finally {

        if (in_community === true) {
          const countryRef = doc(db, "global_community_itineraries", destination);
          const countryDoc = await getDoc(countryRef);

          // Check if other itineraries still exist under the country for the community

          if (countryDoc.exists()) {
            const communityItinerariesRef = collection(countryRef, "Itineraries");
            const remainingItineraries = await getDocs(communityItinerariesRef);
              if (remainingItineraries.empty) {
                // If no other itineraries, delete the country document
                console.log("FINALLY EMPTY")
                deleteDoc(countryRef)
              } else {
                console.log("STILL NOT EMPTY")
              }
          }
        }
      }
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

    dragStart(event, index, day) {
      this.draggingItem = index;
      this.draggingDay = day;
      event.dataTransfer.effectAllowed = "move";
      event.target.classList.add("dragging"); // Add dragging class
      console.log("Initial Drag", day, index);
    },

    dragOver(event, index) {
      event.preventDefault(); // Necessary to allow dropping
      event.target.classList.add("over"); // Add class when an item is dragged over another
    },

    dragLeave(event) {
      event.target.classList.remove("over"); // Remove class when the dragging item leaves the element
    },

    dragEnd(event) {
      const elements = document.querySelectorAll(".location-details");
      elements.forEach((element) => element.classList.remove("dragging"));
    },

    drop(event, index, day) {
      event.preventDefault(); // To ensure custom drop logic can execute
      event.target.classList.remove("over"); // Remove class on drop
      console.log("Final Drag", day, index);

      // Get items in origin where the day is equals to origin day
      this.sourceDayArray = this.itineraryData.filter(
        (item) => item.day === this.draggingDay
      );

      // Removes the dragged item from the sourceDayarray and store in variable
      const itemToMove = this.sourceDayArray.splice(this.draggingItem, 1)[0];

      if (this.draggingDay !== day) {
        // Checks if it is a multi day drag and drop
        itemToMove.day = day; // Update the item's day to the target day
        this.targetDayArray = this.itineraryData.filter(
          (item) => item.day === day
        );
        this.targetDayArray.splice(index, 0, itemToMove); // removes 0 item and adds itemToMove to targetday array
      } else {
        this.sourceDayArray.splice(index, 0, itemToMove); // removes 0 item and adds itemToMove
      }
      this.updateItineraryData(day, index); // Update Firebase backend
    },

    async updateItineraryData(day, index) {
      if (this.draggingDay === day && this.draggingItem != index) {
        // SAME DAY REARRANGING
        const db = getFirestore(firebaseApp);
        const daysRef = collection(
          db,
          "global_user_itineraries",
          this.itineraryId,
          "days"
        );

        // Fetch the day document
        const querySnapshot = await getDocs(
          query(daysRef, where("day", "==", day))
        );

        if (!querySnapshot.empty) {
          const dayDoc = querySnapshot.docs[0];
          const locationsRef = collection(dayDoc.ref, "locations");
          const locationsSnapshot = await getDocs(locationsRef);

          let locationsArray = locationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          locationsArray.sort((a, b) => a.order - b.order); // Sort once before modifications

          const itemToMove = locationsArray.splice(this.draggingItem, 1)[0]; // Removes dragged item from array and store in variable
          locationsArray.splice(index, 0, itemToMove); // Inserts dragged item back

          locationsArray = locationsArray.map((loc, idx) => ({
            ...loc,
            order: idx + 1,
          })); // Reassigns order number

          try {
            for (const loc of locationsArray) {
              const locRef = doc(locationsRef, loc.id);
              await updateDoc(locRef, { order: loc.order });
            }
          } catch (error) {
            console.error("Error updating order:", error);
          } finally {
            this.fetchData();
          }
        }
      } else if (this.draggingDay !== day) {
        // MULTI DAY REARRANGING
        const db = getFirestore(firebaseApp);
        const daysRef = collection(
          db,
          "global_user_itineraries",
          this.itineraryId,
          "days"
        );

        // Fetch the Origin day document
        const sourceDayDoc = await getDocs(
          query(daysRef, where("day", "==", this.draggingDay))
        );
        // Fetch the Destination day document
        const targetDayDoc = await getDocs(
          query(daysRef, where("day", "==", day))
        );

        if (!sourceDayDoc.empty && !targetDayDoc.empty) {
          const sourceDayRef = sourceDayDoc.docs[0].ref;
          const targetDayRef = targetDayDoc.docs[0].ref;

          // Locations reference for both days
          const sourceLocationsRef = collection(sourceDayRef, "locations");
          const targetLocationsRef = collection(targetDayRef, "locations");

          // Fetch locations from both days
          const [sourceLocations, targetLocations] = await Promise.all([
            getDocs(sourceLocationsRef),
            getDocs(targetLocationsRef),
          ]);

          let sourceLocationsArray = sourceLocations.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          sourceLocationsArray.sort((a, b) => a.order - b.order); // Sort once before modifications

          const itemToMove = sourceLocationsArray.splice(
            this.draggingItem,
            1
          )[0]; // Removes dragged item from array and store in variable
          if (itemToMove) {
            // Delete the document from the source location in firebase
            await deleteDoc(doc(sourceLocationsRef, itemToMove.id));
          }

          // Add the item to the target array and set a new order
          itemToMove.order = index;
          itemToMove.day = day;
          const { id, ...itemData } = itemToMove;
          const newItemRef = doc(targetLocationsRef, itemToMove.id); // Use the original item's ID
          await setDoc(newItemRef, itemData);

          sourceLocationsArray = sourceLocationsArray.map((loc, idx) => ({
            ...loc,
            order: idx + 1,
          })); // Reassigns order number

          let targetLocationsArray = targetLocations.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          targetLocationsArray.sort((a, b) => a.order - b.order); // Sort once before modifications

          targetLocationsArray.splice(index, 0, itemToMove); // Inserts dragged item into new list

          targetLocationsArray = targetLocationsArray.map((loc, idx) => ({
            ...loc,
            order: idx + 1,
          })); // Reassigns order number

          try {
            for (const loc of sourceLocationsArray) {
              const locRef = doc(sourceLocationsRef, loc.id);
              await updateDoc(locRef, { order: loc.order });
            }
            for (const loc of targetLocationsArray) {
              const locRef = doc(targetLocationsRef, loc.id);
              await updateDoc(locRef, { order: loc.order });
            }
          } catch (error) {
            console.error("Error updating order:", error);
          } finally {
            this.fetchData();
          }
        }
      } else {
        console.log("IT IS THE SAME DAY");
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
        const locationsArray = allLocations.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Find the order of the location to be deleted
        const locationToDelete = locationsArray.find((loc) => loc.id === locid);
        const orderToDelete = locationToDelete.order;

        // Filter out the location to delete and adjust the order of the rest
        const updatedLocations = locationsArray
          .filter((loc) => loc.id !== locid)
          .map((loc) => {
            if (loc.order > orderToDelete) {
              // Only decrement order for locations after the one to delete
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
        }

        alert("Location deleted successfully and order updated!");
      } catch (error) {
        console.error("Error deleting location:", error);
      } finally {
        this.fetchData(); // Refresh the data to reflect the updated order
        console.log("fetched data after deleting location");
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

    async shareToCommunity() {
      const userId = this.getCurrentUserId();
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const userItineraryRef = doc(
        db,
        "global_user_itineraries",
        this.itineraryId
      );
      const userItinerarySnap = await getDoc(userItineraryRef);
      const userItineraryData = userItinerarySnap.data();
      const destinationRef = doc(
        db,
        "global_community_itineraries",
        this.destination
      );
      const destinationSnap = await getDoc(destinationRef);

      // If the destination does not exist, initialize it.
      if (!destinationSnap.exists()) {
        await setDoc(destinationRef, { imageURL: userItineraryData.imageURL });
      }

      const communityItineraryRef = doc(
        db,
        "global_community_itineraries",
        this.destination,
        "Itineraries",
        this.itineraryId
      );
      try {
        await setDoc(communityItineraryRef, {
          ...userItineraryData,
          userId: userId,
          votes: 0,
        });
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userVoteRef = doc(communityItineraryRef, "userVotes", userId);
          await setDoc(userVoteRef, {
            voted: false,
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
      const querySnapshot = await getDocs(
        query(usersRef, where("username", "==", this.username))
      );

      if (querySnapshot.empty) {
        alert(
          "No user found with that username. Please enter a valid username!!"
        );
        this.username = "";
        return;
      }

      // Iterate through each found user document
      querySnapshot.forEach(async (userDoc) => {
        // Reference to the specific itinerary document under the user's 'itineraries' sub-collection
        const itineraryDocRef = doc(
          userDoc.ref,
          "itineraries",
          this.itineraryId
        );

        // Get the document to check if it exists
        const docSnap = await getDoc(itineraryDocRef);

        if (docSnap.exists()) {
          // Document exists, so the itinerary is already shared
          alert(
            `This itinerary is already shared with ${userDoc.data().username}!`
          );
          this.username = "";
          return;
        } else {
          // Document does not exist, share the itinerary
          await setDoc(itineraryDocRef, {}); // Add an empty object or any data you want to store
          alert(
            `Your itinerary has been shared with ${
              userDoc.data().username
            } successfully!`
          );
        }
      });

      // Reset dropdown state
      this.sharingToUser = false;
      this.showDropdown = false;
      this.username = ""; // Reset the username input
    },

    toggleDropdownEditTitle(event) {
      event.stopPropagation();
      this.showDropdownEditTitle = !this.showDropdownEditTitle;
      if (this.edittingTitle = true) {
        this.edittingTitle = false;
      }
      if (this.edittingDateRange = true) {
        this.edittingDateRange = false;
      }
      console.log("Edit Title Dropdown status: ", this.showDropdownEditTitle);
    },

    handleOutsideClick() {
      this.showDropdownEditTitle = false;
      this.edittingTitle = false;
      this.edittingDateRange = false;
      this.showDropdown = false;
      this.sharingToUser = false;
    },

    editTitle(event) {
      event.stopPropagation();
      this.edittingTitle = true;
    },

    editDateRange(event) {
      event.stopPropagation();
      this.edittingDateRange = true;
    },

    async changeTitle(new_title) {
      const global_user_itineraries_ref = collection(
        db,
        "global_user_itineraries"
      );
      const itineraryDoc = doc(global_user_itineraries_ref, this.itineraryId);

      try {
        updateDoc(itineraryDoc, { title: new_title }).then(() => {
          console.log("Title updated successfully!");
          window.alert("Title updated successfully!");
          this.fetchData();
        });
      } catch (error) {
        console.error("Error updating title:", error);
      }
    },

    async changeDateRange(new_dateRange) {
      const global_user_itineraries_ref = collection(
        db,
        "global_user_itineraries"
      );
      const itineraryDoc = doc(global_user_itineraries_ref, this.itineraryId);

      try {
        updateDoc(itineraryDoc, { dateRange: new_dateRange }).then(() => {
          console.log("Date Range updated successfully!");
          window.alert("Date Range updated successfully!");
          this.fetchData();
        });
      } catch (error) {
        console.error("Error updating Date Range:", error);
      }
    },

    toggleEdittingDescription(event) {
      event.stopPropagation();
      this.edittingDescription = !this.edittingDescription;
      console.log("Edit Description status: ", this.showDropdownEditTitle);
    },

    async changeDescription(dayid, locid, new_description_input) {
      const itineraryId = this.itineraryId;
      const locationsRef = collection(
        db,
        "global_user_itineraries",
        itineraryId,
        "days",
        dayid,
        "locations"
      );
      const locationDoc = doc(locationsRef, locid);

      try {
        updateDoc(locationDoc, { description: new_description_input }).then(
          () => {
            console.log("Description updated successfully!");
            window.alert("Description updated successfully!");
            this.fetchData();
          }
        );
      } catch (error) {
        console.error("Error updating description:", error);
      }
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
