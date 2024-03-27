<template>
    <div class ="trips container">
        <h1>Your Trips</h1>
        <div class="cards">
            <itinerary-card
                v-for="itinerary in itineraries" 
                :key="itinerary.id"     
                :itinerary:="itinerary" />
        </div>
    </div>
</template>

<script>
import ItineraryCard from './ItineraryCard.vue';

export default {
    components: {
        ItineraryCard
    },
    data() {
        return {
            itineraries: [
                
            ]
        }
    }
}
</script>

<style>

</style>