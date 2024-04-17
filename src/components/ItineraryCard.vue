<template>
  <div class="itinerary-details" @click="navigateToItinerary">
    <img class="itinerary-pic" :src="itineraryPic" :alt="title" />
    <div class="card-content">
      <h3>{{ title }}</h3>
      <div class="itinerary-info">
        <h3 class="card-title">{{ destination }}</h3>
        <p class="card-dates">{{ startDate }} - {{ endDate }}</p>
      </div> 
    </div>
  </div>
</template>

<script>
import ItinerariesView from '@/views/ItinerariesView.vue';

export default {
  props: {
    id: String,
    title: String,
    destination: String,
    itineraryPic: String,
    selected: Boolean,
    startDate: String,
    endDate: String,
  },
  computed: {
    isSelected() {
      return this.selected;
    },
  },
  methods: {
    navigateToItinerary() {
      this.$router.push({name: 'Itineraries', params: {itineraryId: this.id}} );
    }
  }
};
</script>

<style scoped>
.itinerary-details {
  width: 300px;
  min-height: 350px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.itinerary-details:hover {
  transform: scale(1.01);
  opacity: 0.80;
}

.itinerary-info {
  padding: 1px;
  text-align: center;
}

.card-title {
  margin: 10px 0;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

.card-dates {
  margin: 8px 0 0;
  font-weight:400;
  font-size: 16px;
}

.itinerary-pic {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
