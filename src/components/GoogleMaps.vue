<template>
    <div class="map-container" ref="map"></div>
    <div id="custom-info-window" class="custom-info-window"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';


export default {
    name: "GoogleMaps",
    props: {
        selectedPlace: Object,
        itineraryId: String,
        destination: String,  // Accept destination as a prop
    },
    data() {
        return {
            map: null,
            markers: [],
            directionsRenderer: null, // Add this to manage the route renderer
        };
    },

    computed: {
        // Map getters to get the locations from the store
        ...mapGetters('locations', ['allLocations', 'selectedLocation', 'tempLocation']),
    },

    async mounted() {
        await this.loadMapScript();

        document.addEventListener("click", this.handleClickOutside);
    },

    beforeDestroy() {
        document.removeEventListener("click", this.handleClickOutside)
    },

    methods: {
        // ...mapActions('locations', ['fetchLocations']),

        handleClickOutside(event) {
            let infoWindowElement = document.getElementById('custom-info-window');
            let insideTravelTime = event.target.closest('.travel-time');

            // Ensure the map reference is not null before checking containment
            if (infoWindowElement && !infoWindowElement.contains(event.target) &&
                this.$refs.map && !this.$refs.map.contains(event.target)) {
                // &&
                // (!this.formTempMarker || !this.formTempMarker.getIcon().contains(event.target))) 

                this.hideInfoWindow(); // Hide the info window
                if (this.tempMarker) {
                    this.tempMarker.setMap(null); // Remove previous marker
                }
            }
            if (!insideTravelTime && this.directionsRenderer) {
                if (this.directionsRenderer) {
                    this.directionsRenderer.setMap(null); // Clear the route display
                    this.directionsRenderer = null; // Remove the renderer instance if not needed
                }
            }
        },

        loadMapScript() {
            // Check if Google Maps API Script is already loaded in the global scope to avoid loading multiple times
            if (typeof google !== 'undefined' && google.maps) {
                this.initMap();
                return;
            }

            if (this.destination) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: this.destination }, (results, status) => {
                    if (status === 'OK' && results.length > 0) {
                        const location = results[0].geometry.location;
                        this.map.setCenter(location);
                    } else {
                        console.error('Geocode was not successful:', status);
                    }
                });
            }

            // Create a script element to load the Google Maps API
            const script = document.createElement('script');

            // CHANGE API KEY ACCORDINGLY
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEIJoWm0qw_YiyrWisG2F_b96Ca20wrR4&loading=async&libraries=places&callback=initMap`;
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
            const defaultLocation = { lat: 1.3408578, lng: 103.8054434 }; // Center the map on Singapore by default if Geolocation fails
            const defaultZoom = 12; // Default zoom level

            const mapOptions = {
                center: defaultLocation,
                zoom: defaultZoom,
                minZoom: 5, // Prevents zooming out too much
            };

            this.map = new google.maps.Map(this.$refs.map, mapOptions);

            console.log(this.destination)

            if (this.destination) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: this.destination }, (results, status) => {
                    if (status === 'OK' && results.length > 0) {
                        const location = results[0].geometry.location;
                        const addressType = results[0].types[0]; // Get the most specific type of the location
                        const viewport = result.geometry.viewport;

                        console.log("OK", location)

                        // Use the viewport to set the bounds
                        this.map.fitBounds(viewport);

                        // Adjust zoom manually if needed
                        if (result.types.includes('country')) {
                            this.map.setZoom(Math.min(this.map.getZoom(), 8)); // Prevent too close zoom on large countries
                        }
                    } else {
                        console.error('Geocode was not successful:', status);
                    }
                });
            }

            this.createMarkers(); // Initial marker creation

            // Set up a click listener on the map
            this.map.addListener("click", (e) => {

                // Add a temporary marker
                if (this.tempMarker) {
                    this.tempMarker.setMap(null); // Remove previous marker
                }

                this.tempMarker = new google.maps.Marker({
                    position: e.latLng,
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        url: "../src/assets/Location_Pin_HTLV.png",
                        scaledSize: new google.maps.Size(30, 30),
                    }
                })

                console.log("TEST", this.tempMarker)

                this.fetchPlaceInfo(e.latLng, true);
            });
        },

        fetchPlaceInfo(latLng, shouldHideIfEmpty = false) {
            console.log("RUNNING FETCHPLACEINFO")
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
                        if (shouldHideIfEmpty) {
                            this.hideInfoWindow(); // Ensure this method is defined to hide the window
                        }
                    }
                }
            });
        },

        hideInfoWindow() {
            let infoWindowElement = document.getElementById('custom-info-window');
            if (infoWindowElement) {
                infoWindowElement.style.display = 'none';
            }
        },

        async getPlaceDetails(placeId) {  // placeId is a unique identifier in the Google Places database
            console.log("RUNNING getPLACEDETAILS")
            const service = new google.maps.places.PlacesService(this.map); // Initialize PlacesService
            console.log("placeId: ", placeId)
            // Requests for detailed information
            service.getDetails({
                placeId: placeId,
                fields: ['name', 'rating', "user_ratings_total", 'formatted_address', 'website', 'formatted_phone_number', "geometry"]
            }, (place, status) => {   // The second argument here: (place, status) is the callback function that handles the response
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const marker = this.markers.find(m => m.placeId === placeId);
                    if (marker) {
                        // Pan the map to the center of the marker
                        this.map.panTo(marker.getPosition());
                        setTimeout(() => {
                            this.map.setZoom(15);  // Adjust zoom level as needed
                        }, 400);  // Delay in milliseconds

                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(() => {
                            marker.setAnimation(null);
                        }, 2100);
                        this.showInfoWindow(place, marker.day, marker.stop);
                    } else {
                        console.log("marker was not found")
                        console.log(place)
                        this.showInfoWindow(place);
                    }
                }
            });
        },

        showInfoWindow(place, day = 0, stop = 0) {
            console.log(place);
            // Start building the content string with HTML elements to display place details

            let ratingsDisplay = place.rating && place.user_ratings_total ? `${place.rating} (${place.user_ratings_total})` : '';

            let headerContent = (day !== 0 || stop !== 0) ? `Day ${day}: Stop ${stop}` : ''; // Only show Day and Stop if they are not zero

            let contentString = `
                <div class='info-window'>
                    <span class='close-btn' style="position: absolute; top: 5px; right: 40px; width : 25px ; height: 25px; text-align: center; display: inline-block; line-height: 25px; align-items: center;
                    cursor: pointer; font-size: 15px; color: #333; background-color: #DC143C ; color: white ; border-radius: 50%" ;>&times;</span>
                    ${headerContent && `<div class='info-window-header' style="font-size: 1.5rem; font-weight: bold; color: #333; margin-bottom: 10px; margin-top: 8px">
                        <i class="fas fa-map-marker-alt" style="color: #FF6347; margin-left: 5px; margin-right: 5px;"></i> ${headerContent}</div>`}
                    <h2 style = "margin-top:2px; font-size: 22px"><i class="fas fa-landmark" style="color: green; margin-right: 10px; padding: 5px"></i>${place.name}</h2> 
                    <ul class='info-list' style = "list-style-type: none">
                        ${ratingsDisplay ? `<li><i class="fas fa-star" style="color: #007bff; margin-right: 10px; margin-left: -2px;"></i><strong>Ratings:</strong> ${ratingsDisplay}</li>` : ''}
                        <li><i class="fas fa-map-marker-alt" style="color: #007bff; margin-right: 10px;"></i><strong> Address:</strong> ${place.formatted_address}</li>  
                        ${place.website ? `<li> <i class="fas fa-globe" style="color: #007bff; margin-right: 10px;"></i><strong>Website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></li>` : ''}  
                        ${place.formatted_phone_number ? `<li> <i class="fas fa-phone-alt" style="color: #007bff; margin-right: 10px;"></i><strong>Phone Number:</strong> ${place.formatted_phone_number}</li>` : ''} 
                    </ul>
                </div>`;

            const infoWindowElement = document.getElementById('custom-info-window');
            infoWindowElement.innerHTML = contentString;
            infoWindowElement.style.display = 'block'; // Show the info window

            let closeButton = infoWindowElement.querySelector('.close-btn');
            closeButton.onclick = () => { this.hideInfoWindow(); };
        },

        displayRoute(originLat, originLng, destLat, destLng) {
            if (!this.map) return; // Ensure the map is loaded

            const directionsService = new google.maps.DirectionsService();  // Initialize Directions Service

            if (!this.directionsRenderer) {
                this.directionsRenderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    polylineOptions: {
                        strokeColor: "#FF5A5F", // Example: Red color for the route
                        strokeWeight: 6,       // Line thickness
                        strokeOpacity: 0.8,
                    },
                });
            }

            directionsService.route({
                origin: { lat: originLat, lng: originLng },
                destination: { lat: destLat, lng: destLng },
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status === 'OK') {
                    this.directionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }.bind(this));
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
                const position = new google.maps.LatLng(location.latitude, location.longitude);
                const marker = new google.maps.Marker({
                    map: this.map,
                    position: position,
                    title: location.location,
                    icon: {
                        url: "../src/assets/Location_Pin_HTLV.png",
                        scaledSize: new google.maps.Size(30, 30),
                        // anchor: new google.maps.Point(20, 40)
                    },
                    placeId: location.placeId,
                    day: location.day,
                    stop: location.order

                });

                marker.addListener('click', (event) => {
                    if (location.placeId) {
                        this.getPlaceDetails(location.placeId); // Using the stored placeId
                    }

                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(() => {
                        marker.setAnimation(null);
                    }, 2100);
                });

                console.log("POSITION", location)


                // Save the marker to the array
                this.markers.push(marker);
                bounds.extend(position);

            });

            console.log("markers after creation")

            // Adjust the map to show all the markers
            if (this.markers.length > 0) {
                this.map.fitBounds(bounds); // Automatically adjusts both zoom and center of the map
            } 
            if (this.markers.length === 1) {
                this.map.setZoom = 5; // Automatically adjusts both zoom and center of the map
            } 
        },
        showFormTempMarker(latLng, name, placeId) {
            console.log("In showFormTempMarker")
            if (this.formTempMarker) {
                this.formTempMarker.setMap(null); // Remove existing temporary marker if it exists
            }
            this.formTempMarker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: name,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: "../src/assets/Location_Pin_HTLV.png",
                    scaledSize: new google.maps.Size(30, 30),
                }
            });

            this.map.panTo(latLng);
            this.map.setZoom(15);

            if (placeId) {
                console.log("placeId is valid")
                this.getPlaceDetails(placeId); // Use the placeId to fetch and display details
            } else {
                // Optionally handle the case where no placeId is provided
                console.error("placeId is not valid")
            }
        },

        clearFormTempMarker() {
            if (this.formTempMarker) {
                this.formTempMarker.setMap(null);
                this.formTempMarker = null;
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
        selectedLocation: {
            deep: true,
            immediate: true,
            handler(newLocation) {
                console.log("Selected Location Changed:", newLocation);
                if (newLocation && newLocation.placeId) {
                    this.getPlaceDetails(newLocation.placeId);
                }
            },
        },
        tempLocation(newLocation) {
            console.log("temp location watcher, new location is: ", newLocation)
            if (newLocation && newLocation.latitude && newLocation.longitude) {
                // If there's valid location data, show the form marker
                console.log("valid location data")
                const latLng = new google.maps.LatLng(newLocation.latitude, newLocation.longitude);
                this.showFormTempMarker(latLng, newLocation.name, newLocation.placeId);
            } else {
                // If the temp location data is null or invalid, clear the existing form marker
                this.clearFormTempMarker();
            }
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

.custom-info-window {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fafafa;
    padding: 15px;
    padding-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: none;
    text-align: left;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Subtle shadow */
    /* Soft shadow for depth */
    font-family: 'Arial', sans-serif;
    /* Ensuring consistent typography */
    font-size: 0.9rem;
    /* Slightly smaller font size for better reading */
    color: #333;
    /* Darker text for better readability */
    line-height: 1.4;
    /* Improved line spacing */
}
</style>