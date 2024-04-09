<template>
  <div class="itinerary-details">
    <img class="itinerary-pic" :src="itineraryPic" :alt="title" />
    <h3>{{ title }}</h3>
    <div class="itinerary-info">
      <h3 class="card-title">{{ destination }}</h3>
      <p class="card-dates">{{ startDate }} - {{ endDate }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profilePic: String,
    name: String,
    title: String,
    destination: String,
    itineraryPic: String,
    selected: Boolean,
    type: String,
    startDate: String,
    endDate: String,
  },
  computed: {
    isSelected() {
      return this.selected;
    },
  },
};
</script>

<style scoped>
.itinerary-details {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #ffcbcb;
  width: 200px;
  overflow: hidden;
  box-shadow: 0 4px 8 px rgba(0, 0, 0, 0, 2);
}

.itinerary-info {
  background-color: #ffcbcb;
  padding: 1px;
  text-align: center;
}

.card-title {
  margin: 0;
  font-weight: bold;
  color: #333;
}

.card-dates {
  margin: 8px 0 0;
  color: #666;
}

.itinerary-pic {
  width: 100%;
  border-radius: 8px;
  display: block;
}
</style>
