<template>
  <div class="search-bar">
    <input type="text" v-model="searchQuery" @focus="initializeAutocomplete" placeholder="Search..." ref="autocomplete">
    <button type="submit" class="submit-btn" @click="submitSearch">
      <img src="/src/assets/HTLVlogo.png" alt="Search" class="submit-icon" />
    </button>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: 'CommunitySearch',
  data() {
    return {
      searchQuery: '',
      autocomplete: null,
      selectedCountry: null
    };
  },
  methods: {
    initializeAutocomplete() {
      if (this.autocomplete) {
        console.log('Autocomplete already initialized.');
        return;
      }
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log('API Key:', apiKey);
      const loader = new Loader({
        apiKey: apiKey,
        libraries: ["places"],
      });

      loader.load().then(() => {
        this.autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete, {
          types: ["(regions)"],
        });

        this.autocomplete.addListener('place_changed', this.onPlaceChanged); 
      }).catch(e => {
        console.error("Error loading Google Maps JavaScript API Library: ", e);
      });
    },
    onPlaceChanged() {
      const place = this.autocomplete.getPlace();
      if (!place.geometry) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }
      this.selectedCountry = {
        name: place.name,
        code: place.place_id
      };
    },
    submitSearch() {
      if (this.selectedCountry) {
        this.$emit('submit', this.selectedCountry);
      } else {
        console.log('No country selected to submit');
      }
    }
  }
};
</script>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: 20px;
  margin-left: 100px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 4px;
  width: 300px;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
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
