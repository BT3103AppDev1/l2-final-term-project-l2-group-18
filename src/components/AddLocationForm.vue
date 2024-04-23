<template>
  <button class="close-button" @click="closeForm()">X</button>
  <h1>Add New Location</h1>
  <form @submit.prevent="saveLocation">
    <label for="location">Select Location</label>
    <PlacesSearchBar
      ref="placesSearchBar"
      @place-selected="handlePlaceSelection"
    />

    <!-- <input class="location" v-model="formData.location" type="text" placeholder="Enter Location Title" required /> -->
    <label for="description">Description</label>
    <textarea
      class="description"
      v-model="formData.description"
      placeholder="Enter Description"
      required
    ></textarea>
    <label for="category">Category</label>
    <select
      name="category"
      class="category"
      v-model="formData.category"
      required
    >
      <option value="" disabled selected>Select Category</option>
      <option value="Food">Food</option>
      <option value="Bar">Bar</option>
      <option value="Adventure">Adventure</option>
      <option value="Hotel">Hotel</option>
      <option value="Nature">Nature</option>
      <option value="Sightseeing">Sightseeing</option>
      <option value="Shopping">Shopping</option>
      <option value="Religious Site">Religious Site</option>
      <option value="Others">Others</option>
    </select>
    <button type="submit" class="save-button">Save</button>
  </form>
</template>

<script>
import { firebaseApp, auth } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
import PlacesSearchBar from "./PlacesSearchBar.vue";

export default {
  name: "AddLocationForm",
  components: {
    PlacesSearchBar,
  },
  props: {
    dayNumber: Number,
    itineraryId: String,
  },
  data() {
    return {
      // Defining data properties for form inputs
      formData: {
        location: "",
        description: "",
        category: "",
        latitude: null,
        longitude: null,
        country: "",
        placeId: "",
      },
      userId: null, //To store user's ID
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      console.log("User state changed", user);
      if (user) {
        this.userId = user.uid;
      } else {
        // Handle the case when the user is signed out if needed
        this.userId = null;
      }
    });
  },

  methods: {
    closeForm() {
      this.$emit("closeForm");
      this.$store.dispatch('locations/clearTempLocation'); // Clear temp marker when form is closed
    },

    async saveLocation() {
      console.log("saveLocation called"); // Add this line to check if the method is called
      if (!this.userId) {
        alert("You must be logged in to save a location.");
        return;
      }
      // Assumes itineraryId is passed as a prop or can be otherwise obtained
      const itineraryId = this.itineraryId;
      console.log(this.itineraryId);
      console.log(this.dayNumber);
      try {
        // Construct the document path where the location data will be saved
        const q = query(
          collection(db, "global_user_itineraries", itineraryId, "days"),
          where("day", "==", this.dayNumber)
        );
        const daySnapshot = await getDocs(q);
        console.log(daySnapshot.docs);
        const dayDocId = daySnapshot.docs[0].id;
        const locationRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days",
          dayDocId,
          "locations"
        );

        // Fetch existing locations to determine the new order
        const snapshot = await getDocs(locationRef);
        const order = snapshot.size + 1; // This is the new location's order index

        await addDoc(locationRef, {
          ...this.formData, //spread operator to include all form data
          order: order, // Inserted Order field here
          day: this.dayNumber,
          placeId: this.formData.placeId, // placeId for Places API
        });

        window.alert("Location added successfully to the day!");

        this.$emit("saveLocation");
        this.$store.dispatch('locations/clearTempLocation'); // Clear temp marker when location is saved
        // Reset form data
        // this.formData = { location: "", description: "", category: "" };
        this.resetForm();
      } catch (error) {
        console.error("Error adding location: ", error);
      }
    },

    resetForm() {
      this.formData = {
        location: "",
        description: "",
        category: "",
        latitude: null,
        longitude: null,
        country: "",
      };
      this.$refs.placesSearchBar.reset();
    },

    getCountryFromAddressComponents(addressComponents) {
      const country = addressComponents.find((component) =>
        component.types.includes("country")
      );

      return country ? country.long_name : "";
    },

    handlePlaceSelection(place) {
      const country = this.getCountryFromAddressComponents(
        place.address_components
      );

      this.formData.location = place.name; // Use the name property from the place object
      this.formData.latitude = place.geometry.location.lat();
      this.formData.longitude = place.geometry.location.lng();
      this.formData.country = country;
      this.formData.placeId = place.place_id;

      console.log("formData after place selection:", this.formData);

      // Extract relevant place data and dispatch to store
      const locationData = {
        name: place.name,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        placeId: place.place_id,
      };
      this.$store.dispatch('locations/updateTempLocation', locationData);

    },
  },
}
</script>

<style scoped>
h1 {
  text-align: left;
  margin-top: 2rem;
  padding-left: 3rem;
}

.form-container {
  padding: 4rem;
}

form {
  margin-top: -3rem;
  padding: 4rem;
}

.close-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #808080;
  color: #fff;
  border: none;
  cursor: pointer;
  display: block;
  margin-left: 2rem;
  margin-top: 2rem;
}

label {
  display: block;
  text-align: left;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 1rem;
}

input {
  width: -webkit-fill-available;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
}

textarea {
  width: -webkit-fill-available;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
  font-family: Arial, Helvetica, sans-serif;
  height: 5rem;
}

select {
  width: -webkit-fill-available;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
}

select:required:invalid {
  color: gray;
}

option[value=""][disabled] {
  display: none;
}

option {
  color: black;
}

.save-button {
  width: 120px;
  padding: 0.5rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
}
</style>
