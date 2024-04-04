<template>
  <button class="close-button" @click="closeForm()">X</button>
  <form @submit.prevent="saveLocation">
    <label for="location">Location</label>
    <input
      class="location"
      v-model="formData.location"
      type="text"
      placeholder="Enter Location Title"
      required
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

export default {
  name: "AddLocationForm",
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
      },
      userId: null //To store user's ID
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
      const itineraryId = "OjKPjGvFB5mvb0cI0TpF"; 
      
      try {
         // Construct the document path where the location data will be saved
        const locationRef = collection(
          db,
          "users",
          this.userId,
          "itineraries",
          itineraryId, //hardcoded for now
          "locations"
        );
        await addDoc(locationRef, {
          ...this.formData, //spread operator to include all form data
          day: this.dayNumber.toString(),
        });
        alert("Location added successfully to the day!");
        // Reset form data
        this.formData = { location: "", description: "", category: "" };
      } catch (error) {
        console.error("Error adding location: ", error);
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
