<template>
  <div class="trips container">
    <div class="boxes">
      <ItinerariesBox 
        v-for="itinerary in itineraries" 
        :key="itinerary.id" 
        :itinerary="itinerary" 
        :country="country"/>
    </div>
  </div>
</template>

<script>
import ItinerariesBox from './ItinerariesBox.vue';

export default {
    components: {
        ItinerariesBox
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