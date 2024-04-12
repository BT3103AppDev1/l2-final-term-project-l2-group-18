<template>
  <button class="close-button" @click="closeForm()">X</button>
  <form @submit.prevent="saveLocation">
    <label for="location">Select Location</label>
    <PlacesSearchBar ref="placesSearchBar" @place-selected="handlePlaceSelection" />

    <!-- <input class="location" v-model="formData.location" type="text" placeholder="Enter Location Title" required /> -->
    <label for="description">Description</label>
    <textarea class="description" v-model="formData.description" placeholder="Enter Description" required></textarea>
    <label for="category">Category</label>
    <select name="category" class="category" v-model="formData.category" required>
      <option value="" disabled selected>Select Category</option>
      <option value="food">Food</option>
      <option value="bar">Bar</option>
      <option value="adventure">Adventure</option>
      <option value="hotel">Hotel</option>
      <option value="nature">Nature</option>
      <option value="sightseeing">Sightseeing</option>
      <option value="shopping">Shopping</option>
      <option value="religious">Religious Site</option>
      <option value="others">Others</option>
    </select>
    <button type="submit" class="save-button">Save</button>
  </form>

</template>

<script>
import { firebaseApp, auth } from "../firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
import PlacesSearchBar from "./PlacesSearchBar.vue"


export default {
  name: "AddLocationForm",
  components: {
    PlacesSearchBar,
  },
  props: {
    dayNumber: Number,
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
        country: ""
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
    },

    async saveLocation() {
      console.log("saveLocation called"); // Add this line to check if the method is called
      if (!this.userId) {
        alert("You must be logged in to save a location.");
        return;
      }
      // Assumes itineraryId is passed as a prop or can be otherwise obtained
      const itineraryId = "testing_document";

      try {
        // Construct the document path where the location data will be saved

        const locationRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days",
          this.dayNumber.toString(),
          "locations"
        );

        const docRef = await addDoc(locationRef, {
          ...this.formData,
          day: this.dayNumber.toString(),
        });

        // This log confirms the document was added
        console.log("Location added successfully with ID:", docRef.id);
        this.resetForm();
      } catch (error) {
        console.error("Error adding location: ", error);
      }
    },

    resetForm() {
      this.formData = {
        location: '',
        description: '',
        category: '',
        latitude: null,
        longitude: null,
        country: ''
      };
      this.$refs.placesSearchBar.reset();
    },

    getCountryFromAddressComponents(addressComponents) {
      const country = addressComponents.find(
        (component) => component.types.includes("country")
      );

      return country ? country.long_name : "";
    },

    handlePlaceSelection(place) {
      const country = this.getCountryFromAddressComponents(place.address_components);

      this.formData.location = place.name; // Use the name property from the place object
      this.formData.latitude = place.geometry.location.lat();
      this.formData.longitude = place.geometry.location.lng();
      this.formData.country = country;

      console.log('formData after place selection:', this.formData);
    },
  },
}
</script>

<style scoped>
.form-container {
  padding: 4rem;
}

form {
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
