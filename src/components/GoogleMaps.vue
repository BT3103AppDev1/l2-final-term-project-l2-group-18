<template> 
    <div class = "map-container" ref = "map"></div>

</template>

<script>

export default {
    name: "GoogleMaps",
    props: {
        selectedPlace: Object,
    },
    data() {
        return {
            map: null,
        };
    },
    mounted() {
        this.loadMapScript();
    },
    methods: {
        loadMapScript() {
            // Check if Google Maps API Script is already loaded in the global scope to avoid loading multiple times
            if (typeof google !== 'undefined' && google.maps) {
                this.initMap();
                return;
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
            // Initialize the Map


            // This could be stored data, and will be dynamically updated
            const markers = [
                {
                    locationName: "The Star Vista",
                    lat: 1.3074159097266027,
                    lng: 103.78847769104704,
                    address: "1 Vista Exchange Green, Singapore 138617"
                },
                {
                    locationName: "Singapore Zoo",
                    lat: 1.407842716800087,
                    lng: 103.79431942192079,
                    address: "80 Mandai Lake Rd, 729826"
                },
                {
                    locationName: "USS Singapore",
                    lat: 1.2572443091996244, 
                    lng: 103.82386625540691,
                    address: "8 Sentosa Gateway, 098269"
                },
                {
                    locationName: "NEX",
                    lat: 1.3519537524416878, 
                    lng: 103.87239724729993,
                    address: "Serangoon Central, 23, Singapore 556083"
                },
                {
                    locationName: "NUS COM3",
                    lat: 1.2951079728030417,
                    lng: 103.77454683882502, 
                    address: "11 Research Link, Singapore 119391"
                }
            ]

            const centerMap = { lat:1.3408578, lng: 103.8054434} // Singapore as default for now

            const mapOptions = {
                center: centerMap,
                zoom: 12,
                // disableDefaultUI: true 
            };
            const map = new google.maps.Map(this.$refs.map, mapOptions);
            this.map = map

            const infoWindow = new google.maps.InfoWindow({
                minWidth: 200,
                maxWidth: 200
            });

            const bounds = new google.maps.LatLngBounds();

            // Loop through all markers
            for (let i = 0 ; i < markers.length; i++) {
                const marker = new google.maps.Marker({
                    position: { lat: markers[i]["lat"], lng: markers[i]["lng"]},
                    map: map
                });

                function createInfoWindows() {
                    const infoWindowContent = `<div class ="content_to_view"> TEST </div>` ;

                    google.maps.event.addListener(marker, "click", function() {
                        infoWindow.setContent(infoWindowContent);
                        infoWindow.open(map, marker)
                    });

                    
                }
                createInfoWindows();

                infoWindow.addListener("closeclick", function() {
                    map.fitBounds(bounds);
                })

                bounds.extend(new google.maps.LatLng(markers[i]["lat"],markers[i]["lng"] ))
                map.fitBounds(bounds)

            }
        },
        addMarkerForPlace(place) {
        // Check if map is initialized
        if (!this.map) {
            console.error("Google Maps not initialized");
            return;
        }
        const location = place.geometry.location;

        // Create a marker for the place
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
        });
        // Center the map on the marker and adjust the zoom level
        this.map.setCenter(location);
        this.map.setZoom(15);
        }
    },
    watch: {
        selectedPlace(newVal, oldVal) {
            if (newVal && newVal.geometry) {
                this.addMarkerForPlace(newVal)
            }
        }
    }
}

</script>

<style scoped>
.map-container {
    position: relative;
    height: 100%; /* Full height */
    width: 100%; /* Full width */

}
</style>