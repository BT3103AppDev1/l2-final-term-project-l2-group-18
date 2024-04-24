<template>
  <button class="close-button" @click="closeForm()">X</button>
  <h1>Edit Location Details</h1>
  <form @submit.prevent="saveLocation">
    <label for="location">Select Location</label>
    <input
      class="location"
      v-model="formData.location"
      type="text"
      placeholder="Select a Place"
      :disabled="true"
    />
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

h1 {
  text-align: left;
  margin-top: 2rem;
  padding-left: 3rem;
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
</style>
