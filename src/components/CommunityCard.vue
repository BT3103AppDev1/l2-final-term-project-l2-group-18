<template>
  <div class="itinerary-card" @click="navigateToItinerary">
    <img class="itinerary-pic" :src="itineraryPic" :alt="title" />
    <div class="card-content">
      <h3 class="title">{{ title }}</h3>
      <div class="profile-info">
        <img class="profile-img" :src="profilePic" :alt="name" />
        <p class="profile-name">{{ name }}</p>
      </div>
    </div>
    <div class="voting">
      <button @click="vote(true, $event)" class="vote-button upvote">
        <i class="fas fa-arrow-up" style="color: green;"></i>
      </button>
      <div class="vote-count">{{ votes }}</div>
      <button @click="vote(false, $event)" class="vote-button downvote">
        <i class="fas fa-arrow-down" style="color: red;"></i>
      </button>
    </div>
  </div>
</template>

<script>
import PlacesToVisitVue from './PlacesToVisit.vue';
export default {
  name: 'CommunityCard',
  props: {
    itineraryPic: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    itineraryId: {
      type: String,
      required: true
    },
    votes: Number,
    userId: String,
  },
  data() {
    return {
      voteValue: 0,
    };
  },
  methods: {
    vote(isUpvote, event) {
      event.stopPropagation();
      // const voteChange = isUpvote ? 1 : -1;
      // if (this.voteValue += voteChange) {
      //   // User is retracting their vote
      //   this.voteValue = 0;
      // } else {
      //   // User is casting a new vote or changing their vote
      //   this.voteValue = voteChange;
      // }

      this.$emit('vote', {
        itineraryId: this.itineraryId,
        //userId: this.userId,
        isUpvote: isUpvote // True or False
      });
    },
    navigateToItinerary() {
      this.$router.push({ name: 'GlobalItineraries', params: { itineraryId: this.itineraryId } });
    },
  }
};
</script>

<style scoped>
.itinerary-card {
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 300px;
  max-width: 300px;
}

.itinerary-pic {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
  min-height: 100px;
}

.title {
  font-size: 1.2em;
  margin: 10px 0;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-name {
  font-size: 0.9em;
  margin: 0;
}

.voting {
  position: absolute;
  right: 15px;
  top: 82%;
  transform: translateY(-50%);
  border-radius: 20px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vote-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  color: #888;
}

.vote-count {
  font-size: 1em;
  color: #333;
  margin: 5px 0;
}
</style>