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
import {
  runTransaction,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  increment
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
  components: {
    CommunityCard,
  },
  props: {
    type: String, // Personal or Community
    country: String,
    itineraryId: String,
  },
  data() {
    return {
      itineraries: [],
    };
  },
  methods: {
    async getCurrentUserId() {
      const auth = getAuth();
      return auth.currentUser ? auth.currentUser.uid : null;
    },
    async handleVote({ itineraryId, isUpvote }) {
      const userId = await this.getCurrentUserId();
      const db = getFirestore();
      const itineraryRef = doc(db, "global_community_itineraries", this.country, "Itineraries", itineraryId);

      try {
        await runTransaction(db, async (transaction) => {
          const userVoteRef = doc(itineraryRef, "userVotes", userId);
          const userVoteDoc = await transaction.get(userVoteRef);

          if (!userVoteDoc.exists() || !userVoteDoc.data().voted) {
            transaction.set(userVoteRef, { voted: true });
            transaction.update(itineraryRef, {
              votes: increment(isUpvote ? 1 : -1)
            });
          } else {
            throw new Error('You have already voted!');
          }
        });

        console.log('Transaction successfully committed!');
        await this.fetchItineraries(this.country);
      } catch (error) {
        console.error('Transaction failed: ', error);
        if (error.message === 'You have already voted!') {
          alert(error.message);
        }
      }
    },
    async fetchItineraries(country) {
      const db = getFirestore();
      this.itineraries = [];
        const itinerariesRef = doc(db, "global_community_itineraries", country, "Itineraries", itineraryId);
        try {
        const docSnap = await getDoc(itinerariesRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const userId = data.userId;
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
            const userData = userSnap.data();
            const itinerary = {
                id: docSnap.id,
                destination: data.destination,
                imageURL: data.imageURL,
                title: data.title,
                votes: data.votes,
                userId: data.userId,
                username: userData.username,
                photoURL: userData.photoURL,
            };
            }
        } else {
            console.error("Document does not exist");
        }
        } catch (error) {
        console.error("Error fetching itinerary:", error);
        }
      }
    },
  async created() {
    if (this.country) {
      await this.fetchItineraries(country);
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
