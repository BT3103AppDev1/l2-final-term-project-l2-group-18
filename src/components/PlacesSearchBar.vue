<template>
    <div class="search-bar-container">
    <input
        type="text"
        ref="searchInput"
        class="search-input"
        placeholder="Add a Place" />
    </div>
</template>

<script>
export default {
    name: 'PlaceSearchBar',
    mounted() {
        this.initAutocomplete();
    },
    methods: {
        initAutocomplete() {
            // Check if Google Maps API Script is already loaded in the global scope 
            if (typeof google === 'undefined' || !google.maps.places) {
                console.error('Google Maps JavaScript API not loaded.');
                return;
            }
            
            // Constructs a new Autocomplete object and attaches this functionality to the search box input
            this.autocomplete = new google.maps.places.Autocomplete(this.$refs.searchInput, {
                types: [], // Remove all restrictions
            });
            
            this.autocomplete.addListener('place_changed', () => {
                const place = this.autocomplete.getPlace();

                // Checks if the place has geomretric data (lat and lng) ; if not, likely user entered a name that wasn't suggested by Autocomplete
                if (!place.geometry) {
                    console.error("No details available for input: '" + place.name + "'");
                    return;
                }
                
                // Emit an event with the selected place
                this.$emit('place-selected', place);
            });
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar-container {
    width: 40vw;
    padding-left: 50px;
  }
  
  .search-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    /* Add more styling as needed */
  }
  </style>
  