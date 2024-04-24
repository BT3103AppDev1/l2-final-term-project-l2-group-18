<template>
  <div class = page-background>
  <button class="close-button" @click="closeForm()">X</button>
  <h1><i class="fas fa-edit"></i>Edit Location Details</h1>
  <form @submit.prevent="saveLocation">
    <label for="location">Location (not editable)</label>
    <input
      class="location"
      v-model="formData.location"
      type="text"
      placeholder="Select a Place"
      :disabled="true"
    />
    <label for="description"><i class="fas fa-align-left"></i>Description</label>
    <textarea
      class="description"
      v-model="formData.description"
      placeholder="Enter Description"
      required
    ></textarea>
    <label for="category"><i class="fas fa-layer-group"></i>Category</label>
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
    <button type="submit" class="save-button"><i class="fa fa-save"></i>Save</button>
  </form>
</div>
</template>

<script>
import { firebaseApp, auth } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);
import PlacesSearchBar from "./PlacesSearchBar.vue";

export default {
  name: "ChangeLocationForm",
  components: {
    PlacesSearchBar,
  },
  props: {
    item: Object,
    itineraryId: String,
  },
  data() {
    return {
      // Defining data properties for form inputs
      formData: {
        location: this.item.location,
        description: this.item.description,
        category: this.item.category,
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
      const itineraryId = this.itineraryId;
      console.log(itineraryId);
      const dayId = this.item.dayid;
      const locationId = this.item.locid;
      try {
        const locationRef = collection(
          db,
          "global_user_itineraries",
          itineraryId,
          "days",
          dayId,
          "locations"
        );
        const locationDoc = doc(locationRef, locationId);
        updateDoc(locationDoc, {
          description: this.formData.description,
          category: this.formData.category,
        }).then(() => {
          window.alert("Location details updated successfully!");
          this.$emit("saveLocation");
        });
      } catch (error) {
        console.error("Error editing location: ", error);
      }
    },
  },
};
</script>

<style scoped>

.form-container {
  padding: 4rem;
}

form {
  margin-top: -3rem;
  padding: 4rem;
}

.close-button {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #808080;
  color: #fff;
  border: none;
  cursor: pointer;
  display: block;
  margin-left: 2rem;
  margin-top: 2rem;
}

h1 {
  text-align: center;
  margin-top: 2rem;
  padding-left: 0;
}

label {
  display: block;
  text-align: left;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
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
  display: flex;
  align-items: left;
  justify-content: center;
  background-color: #ff5b5b;
  cursor: pointer;
  border-radius: 8px;
  color: #fff;
  width: auto; /* Allow button to fit content */
  padding: 0.5rem 1rem; /* Increase padding for visual balance */
  margin-top: 1rem;
  margin-bottom: 2rem;
  margin-left: auto; /* Center the button horizontally */
  margin-right: auto;
  font-size: 0.8rem;
}

.save-button i {
  margin-right: 8px; /* Space between icon and text */
  padding-top: 1px;
}

.location {
  width: -webkit-fill-available;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
  background-color: #e5e5e5;
}

.page-background {
  background-color: #fefff1db; 
  min-height: 100vh; /* Ensures it covers the full height of the viewport */
  padding: 20px;
}

.close-button:hover, .save-button:hover {
  opacity: 0.8; /* Slight transparency on hover */
}

.close-button:focus, .save-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ff5b5b; /* Adding an outline when focused */
}

label i {
  margin-right: 10px;
  color: #114c5d; /* Adjust color as needed */
}

.fa-edit { 
  margin-right: 20px; /* Space between icon and text */
  color: #3e3d3d; /* Icon color to match the save button or any color you prefer */
}

</style>
