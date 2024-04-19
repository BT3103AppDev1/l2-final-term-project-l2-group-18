<template>
    <div class="map-container" ref="map"></div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';


export default {
    name: "GoogleMaps",
    props: {
        selectedPlace: Object,
        itineraryId: String,
    },
    data() {
        return {
            map: null,
            markers: [],
        };
    },

    computed: {
        // Map getters to get the locations from the store
        ...mapGetters('locations', ['allLocations']),
    },

    async mounted() {
        this.loadMapScript();
    },

    methods: {
        // ...mapActions('locations', ['fetchLocations']),

        loadMapScript() {
            // Check if Google Maps API Script is already loaded in the global scope to avoid loading multiple times
            if (typeof google !== 'undefined' && google.maps) {
                this.initMap();
                return;
            }

            // Create a script element to load the Google Maps API
            const script = document.createElement('script');

            // CHANGE API KEY ACCORDINGLY
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDIFDYXIzGzLEUHwn_y72B2g7qiB2yR1g8&loading=async&libraries=places&callback=initMap`;
            script.async = true;
            script.defer = true;

            // Assigns a new property `initMap` to the global window object
            // Google Maps script expects the callback function to be available globally
            // Attach callback function to the `window` object
            window.initMap = this.initMap.bind(this);

            // Append newly created script element to the document
            document.head.appendChild(script);
        },

        initMap() {
            const centerMap = { lat: 1.3408578, lng: 103.8054434 }; // Center the map on Singapore by default
            const mapOptions = {
                center: centerMap,
                zoom: 12,
            };
            this.map = new google.maps.Map(this.$refs.map, mapOptions);

            // Set up a click listener on the map
            this.map.addListener("click", (e) => {
                this.fetchPlaceInfo(e.latLng);
            });

            this.createMarkers(); // Initial marker creation
        },

        fetchPlaceInfo(latLng) {
            const service = new google.maps.places.PlacesService(this.map); // Initialize PlacesService
            
            // Set up Request Object
            const request = {
                location: latLng,
                radius: '10', // This is to specify radius around the `location`, units is meters
            };

            // Execute the search request
            service.nearbySearch(request, (results, status) => {            // The second argument here: (results, status) is the callback function that handles the response
                if (status === google.maps.places.PlacesServiceStatus.OK) {  // Checks that the status is OK
                    const validPlace = results.find(result => result.types.includes('establishment') && result.rating);
                    if (validPlace) {
                        this.getPlaceDetails(validPlace.place_id);   // `getPlaceDetails` is a new function defined below
                    } else {
                        console.error("Failed to fetch place details:". status);
                    }
                }
            });
        },

        async getPlaceDetails(placeId) {  // placeId is a unique identifier in the Google Places database
            const service = new google.maps.places.PlacesService(this.map); // Initialize PlacesService

            // Requests for detailed information
            service.getDetails({
                placeId: placeId,
                fields: ['name', 'rating', "user_ratings_total", 'formatted_address', 'website', 'formatted_phone_number', "geometry"]
            }, (place, status) => {   // The second argument here: (place, status) is the callback function that handles the response
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.showInfoWindow(place);  // If successful, proceeds to display information in an info window. The showInfoWindow is a function defined below. 
                }
            });
        },

        showInfoWindow(place) {
            console.log(place);
            // Start building the content string with HTML elements to display place details
            let contentString = `<div class='info-window'>
                <h2>${place.name}</h2> 
                <p><strong>Rating:</strong> ${place.rating || 'No rating available'}</p>  
                <p><strong>Total Ratings:</strong> ${place.user_ratings_total || 'No ratings count available'}</p>  
                <p><strong>Address:</strong> ${place.formatted_address}</p>  
                ${place.website ? `<p><strong>Website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></p>` : ''}  
                ${place.formatted_phone_number ? `<p><strong>Phone Number:</strong> ${place.formatted_phone_number}</p>` : ''} 
                </div>`;

            // Create a new InfoWindow instance with the content
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 350 
            });

            // Set the InfoWindow position to the location of the place
            infowindow.setPosition(place.geometry.location);

            // Open the InfoWindow on the map
            infowindow.open(this.map);

            // Optional: Close previous InfoWindow when a new one is opened
            if (this.currentInfoWindow) {
                this.currentInfoWindow.close();
            }
            this.currentInfoWindow = infowindow;  // Save the current InfoWindow to potentially close it later
        },

        reinitializeMap() {
            // First, clear all existing markers to ensure they're not lingering around
            this.clearMarkers();

            // Remove the existing map from the DOM to prevent memory leaks
            if (this.map) {
                google.maps.event.clearInstanceListeners(this.map);
                this.$refs.map.innerHTML = ''; // Clear the map container
            }

            // Now, recreate the map
            this.initMap();
        },

        clearMarkers() {
            this.markers.forEach(marker => {
                marker.setMap(null); // This detaches the marker from the map
            });
            this.markers = []; // Clear the array after all markers are removed from the map
        },

        createMarkers() {
            console.log("markers before clearing");
            console.log(this.markers)
            // First, clear existing markers 
            this.clearMarkers();

            const bounds = new google.maps.LatLngBounds();
            this.allLocations.forEach(location => {
                const position = { lat: location.latitude, lng: location.longitude };
                const marker = new google.maps.Marker({
                    map: this.map,
                    position: position,
                    title: location.location,
                });

                // Optionally, add an info window for each marker
                const infoWindow = new google.maps.InfoWindow({
                    content: `<h3>${location.location}</h3><p>${location.description}</p>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(this.map, marker);
                });

                // Save the marker to the array
                this.markers.push(marker);
                bounds.extend(position);
            });
            console.log("markers after creation")
            console.log(this.markers)
            if (this.markers.length > 0) {
                this.map.fitBounds(bounds);
            } else {
                this.map.setCenter({ lat: 1.3408578, lng: 103.8054434 }); // Default center
                this.map.setZoom(12); // Default zoom
            }
        },
    },
    watch: {
        allLocations: {
            deep: true,
            immediate: true,
            handler(locations) {
                if (this.map && locations) {
                    console.log("in allLocations watcher")
                    // console.log(markers)
                    this.reinitializeMap(); // Reinitialize the map whenever locations change
                }
            },
        },
    },
}

</script>

<style scoped>
.map-container {
    position: relative;
    height: 100%;
    /* Full height */
    width: 100%;
    /* Full width */

}
</style>