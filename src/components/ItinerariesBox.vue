<template>
  <div class="itinerary-details">
    <img class="itinerary-pic" :src="itineraryPic" :alt="title" />
    <h3>{{ title }}</h3>
    <div class="profile-info">
      <img class="profile-img" :src="profilePic" :alt="name" />
      <p class="profile-name">{{ name }}</p>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from "../firebaseConfig";
const db = getFirestore(firebaseApp);

export default {
  name: 'ItinerariesBox',
  props: {
    country: {
      type: String,
      required: true
    },
    itineraryId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    itineraryPic: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
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
  width: 300px;
  margin-left: 100px;
}

.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-name {
  font-weight: bold;
  margin: 0;
}

.itinerary-pic {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
