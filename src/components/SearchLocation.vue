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
            <input type="text" id="destination" v-model="trip.destination" placeholder="E.g. Paris, Hawaii, Japan" class="input-destination" />
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
          this.$router.push({name: 'Itineraries', params: {itineraryId: docRef.id}} );
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
        const query = this.trip.destination + " famous attractions";
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
  

<style>
.plan-trip {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
}

.title-group, .input-group, .date-group {
  width: 100%;
  margin-bottom: 1rem;
}

.title-group input, 
.input-group input, 
.date-group .vue-datetimepicker-input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-group.with-border, .date-group.with-border {
  position: relative;
}

.input-group.with-border::after, .date-group.with-border::after {
  display: none;
}

.label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

.submit-btn {
  background-color: ddd;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #e65a5a;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #e65a5a;
}

.submit-icon {
  width: auto;
  height: 25px;
}

.input-group-bottom {
  display: flex;
  gap: 30px;
}

@media (max-width: 600px) {
  .input-group-bottom {
    flex-direction: column;
  }
}

</style>
