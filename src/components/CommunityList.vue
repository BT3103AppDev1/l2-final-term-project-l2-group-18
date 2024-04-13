<template>
  <div class="trips container">
    <div class="cards">
    <CommunityCard
        v-for="itinerary in itineraries"
        :key="itinerary.id"
        :itineraryId="itinerary.id"
        :country="itinerary.destination"
        :title="itinerary.title"
        :itineraryPic="itinerary.imageURL"
        :profilePic="itinerary.photoURL"
        :name="itinerary.username"
        :votes="itinerary.votes"
        @vote="handleVote"
    />
    </div>
  </div>
</template>

<script>
import CommunityCard from "./CommunityCard.vue";
import { mapGetters, mapActions } from "vuex";
import { updateDoc, increment } from 'firebase/firestore';

import {
  runTransaction,
  doc,
  getDoc,
  getDocs,
  addDoc,
  getFirestore,
  collection,
  QuerySnapshot,
  setDoc,
} from "firebase/firestore";
import { handleError } from "vue";
import { getAuth } from 'firebase/auth';

export default {
  components: {
    CommunityCard,
  },
  props: {
    type: String, //Personal or Community
    country: String,
  },
  data() {
    return {
      itineraries: [],
    };
  },
  watch: {
    country(newCountry, oldCountry) {
      if (newCountry !== oldCountry) {
        this.fetchItineraries(newCountry);
      }
    },
  },
  methods: {
    getCurrentUserId() {
      const auth = getAuth();
      return auth.currentUser ? auth.currentUser.uid : null;
    },
    async handleVote({ itineraryId, isUpvote }) {
      const userId = this.getCurrentUserId();
      const db = getFirestore();
      const itineraryRef = doc(db, "global_community_itineraries", this.country, "Itineraries", itineraryId);

      try {
        await runTransaction(db, async (transaction) => {
          const userVoteRef = doc(itineraryRef, "userVotes", userId);
          const userVoteDoc = await transaction.get(userVoteRef);
          
          if (userVoteDoc.data().voted == false) {
            transaction.set(userVoteRef, { voted: true });
            transaction.update(itineraryRef, {
              votes: increment(isUpvote ? 1 : -1)
            });
          } else {
            throw new Error('You have already voted!');
          }
        });

        console.log('Transaction successfully committed!');
        this.fetchItineraries(this.country);
      } catch (error) {
        console.error('Transaction failed: ', error);
        if (error.message === 'You have already voted!') {
          alert(error.message);
        }
      }
    },
    async fetchItineraries(selectedCountry) {
      const db = getFirestore();
      try {
        const itinerariesRef = collection(db, "global_community_itineraries", selectedCountry, "Itineraries");
        const communityItineraries = await getDocs(itinerariesRef);
        const itinerariesWithUsers = communityItineraries.docs.map(async (docSnap) => {
          const data = docSnap.data();
          if (docSnap.exists()) {
            const userId = data.userId;
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            console.log(userData);
            return {
              id: docSnap.id,
              destination: data.destination,
              imageURL: data.imageURL,
              title: data.title,
              votes: data.votes,
              userId: data.userId,
              username: userData.username,
              photoURL: userData.photoURL,
            };
          } else {
            console.log("No document!");
            return null;
          }
        });
        this.itineraries = await Promise.all(itinerariesWithUsers).then(results => results.filter(itinerary => itinerary !== null));
        console.log("Fetch success");
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    },
  },
  created() {
    if (this.country) {
      this.fetchItineraries(this.country);
    }
  },
};
</script>

<style scoped>
.trips.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>
