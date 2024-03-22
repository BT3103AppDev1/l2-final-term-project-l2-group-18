<template>
    <div class = "card">
        <img :src="itinerary.image" alt="" class= "card-image">
        <div clas="card-info">
            <h2 class="card-title">{{ itinerary.title }}</h2>
            <p class ="card-dates">{{  itinerary.dates }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            itinerary: {
                type: Object,
                required: true
            }
        },
        computed: {
            dateStart() {
                return this.formatDate(this.itinerary.dateStart);
            },
            dateEnd() {
                return this.formatDate(this.itinerary.dateEnd)
            }
        },
        methods: {
            formatDate(date) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            }
        }
    }
</script>

<style scoped>
.itinerary-card {
  display: flex;
  flex-direction: column;
  width: 250px; 
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px;
}

.itinerary-image {
  width: 100%;
  height: 150px; 
  object-fit: cover;
}

.itinerary-details {
  padding: 15px;
  background: #fff;
}

.itinerary-title {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.itinerary-dates {
  font-size: 0.9em;
  color: #666;
}
</style>