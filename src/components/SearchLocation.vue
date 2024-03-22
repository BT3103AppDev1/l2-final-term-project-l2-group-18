<template>
    <div class="plan-trip">
      <h1>Plan a new trip</h1>
      <form @submit.prevent="submitForm" class="trip-form">
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
import { onMounted } from "vue";
import { ref } from 'vue';

  export default {
    name: 'PlanTrip',
    components: {
    Datepicker
    },
    data() {
      return {
        trip: {
          destination: '',
          dateRange: [new Date(), new Date()]
        }
      };
    },
    methods: {
      submitForm() {
        console.log('Trip details:', this.trip);
            //TODO: Backend logic to handle location search
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
      }
    },
    mounted() {
      this.initializeAutocomplete();
    }
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
  flex-wrap: wrap;
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

.input-group, .date-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  position: relative;
}

.input-destination {
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 15px;
  /* margin-top: 5px; */
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
