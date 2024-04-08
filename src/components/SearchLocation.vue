<template>
    <div class="plan-trip">
      <h1>Plan a new trip</h1>
      <form @submit.prevent="submitForm" class="trip-form">
        <div class="title-group">
          <span class="label">Title</span>
          <input type="text" id="title" v-model="trip.title" placeholder="Enter trip title" class="input-title" />
        </div>
        <div class="input-group-bottom">
          <div class="input-group with-border">
            <span class = "label">Where?</span>
            <input type="text" id="destination" v-model="trip.destination" placeholder="Search destinations" class="input-destination" />
          </div> 
          <div class="date-group with-border">
            <span class = "label">Dates</span>
            <Datepicker 
              v-model="trip.dateRange" 
              format="dd/MM/yyyy" 
              placeholder="Pick a Date"
              range/>
          </div>
        </div>
        <button type="submit" class="submit-btn">
          <img src="/src/assets/HTLVlogo.png" alt="Plan" class="submit-icon" />
        </button>
      </form>
    </div>
  </template>
  
<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { Loader } from "@googlemaps/js-api-loader";
import {mapGetters, mapActions } from "vuex";
import { doc, setDoc, getDoc, addDoc, getFirestore, collection } from "firebase/firestore";
import user from '@/store/modules/user';

  export default {
    name: 'PlanTrip',
    components: {
    Datepicker
    },
    data() {
      return {
        trip: {
          title: '',
          destination: '',
          dateRange: [new Date(), new Date()],
          imageURL: '',
        }
      };
    },
    computed: {
      ...mapGetters('user', ['userData', 'userUID'])
    },
    methods: {
      async submitForm() {
        await this.fetchImage();
        console.log('Trip details:', this.trip);
        const userId = this.userUID;
        try {
          const globalItinerariesRef = collection(getFirestore(), "global_user_itineraries");
          const docRef = await addDoc(globalItinerariesRef, this.trip);
          await setDoc(doc(getFirestore(), "users", userId , "itineraries", docRef.id), {});
          console.log('Document added with ID:', docRef.id);
          this.$router.push('/itineraries');
        } catch (error) {
          console.error("Error processing form submission:", error);
        }
      },
      initializeAutocomplete() {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          libraries: ["places"]
        });

        loader.load().then(() => {
          if(!google.maps.places) {
            console.log("error");
          } else {
            console.log(google.maps.places);
            const autoComplete = new google.maps.places.Autocomplete(
            document.getElementById('destination'),
            { types: ['(regions)']}
          );
          autoComplete.addListener('place_changed' , () => {
            const place = autoComplete.getPlace();
            this.trip.destination = place.name;
          });
        }
        });
      },
      async fetchImage() {
        const apiKey = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_API_KEY;
        const cx = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
        const query = this.trip.destination; + " attraction";
        const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}&searchType=image`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log(response);
          console.log(data);
          if (data.items && data.items.length > 0) {
            const imageUrl = data.items[0].link;
            console.log(imageUrl);
            this.trip.imageURL = imageUrl;
          } else {
            console.log('No images found');
          }
        } catch (error) {
          console.error("Error fetching image from google api:", error);
        }
      }
    },
    mounted() {
      this.initializeAutocomplete();
    },
}
  </script>
  

<style scoped>
.plan-trip {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  border: 1px solid black;
  background-color: #e7dcdc54;
}

.title-group {
  padding:10px;
}
.input-group.with-border::after, .date-group.with-border::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 0;
  bottom: 0;
  width: 1px; 
  background-color: black;
}

.trip-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 8px;
  max-width: 800px;
  box-sizing: border-box;
  background-color: white;
  margin-bottom: 30px;
}

.trip-form .input-group,
.trip-form .date-group {
  flex: 1;
  margin: 0 10px;
  position: relative;
}

.input-group-bottom {
  display: flex;
  width: 100%;
  justify-content: space-between;
}


.input-destination {
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 15px;
  text-align: center;
}

.label {
  margin-bottom: 10px;
}
.submit-btn {
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 10px;
}

.submit-icon {
  height: 24px;
}
</style>
