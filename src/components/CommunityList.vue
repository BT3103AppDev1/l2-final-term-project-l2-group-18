<template>
  <div class="trips container">
    <div class="cards">
      <CommunityCard v-for="itinerary in itineraries" :key="itinerary.id" :itineraryId="itinerary.id"
        :country="itinerary.destination" :title="itinerary.title" :itineraryPic="itinerary.imageURL"
        :profilePic="itinerary.photoURL" :name="itinerary.username" :votes="itinerary.votes" @vote="handleVote" />
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
import { useRouter } from 'vue-router';
import PlacesToVisitGlobal from "./PlacesToVisitGlobal.vue";

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
      selectedItinerary: null,
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

          const voteStatus = doc(itineraryRef, "userVotes", userId); // either 0, 1, -1
          const voteSnap = await getDoc(voteStatus);
          const voteData = voteSnap.data()
          console.log("CHECKING", voteData)
          // const vote = voteData.vote;

          // Determine the current user's vote state
          const voteChange = isUpvote ? 1 : -1;
          let currentVote = userVoteDoc.exists() ? userVoteDoc.data().vote : 0;
          let newVote = 0;

          if (currentVote === voteChange) { // voteChange is either 1 or -1
            // User is trying to vote the same way again
            throw new Error('You cannot vote more than once.');
          } else if (currentVote === 0) {
            // This is the user's first time voting
            newVote = voteChange;
          } else {
            // User is changing their vote or retracting it
            newVote = (currentVote === -voteChange) ? 0 : voteChange;
          }

          // Set the new vote value
          transaction.set(userVoteRef, { vote: newVote });

          // Update the itinerary's total vote count
          let voteIncrement = newVote - currentVote;
          transaction.update(itineraryRef, { votes: increment(voteIncrement) });
        });

        console.log('Transaction successfully committed!');
        this.fetchItineraries(this.country);
      } catch (error) {
        console.error('Transaction failed: ', error);
        alert(error.message);
      }
    },
    showItinerary(itinerary) {
      // Method to navigate to the itinerary when explicitly requested
      this.$emit('show-itinerary', itinerary);
    },
    async fetchItineraries(selectedCountry) {
      const db = getFirestore();
      this.itineraries = []; // Clear the previous itineraries.
      try {
        const itinerariesRef = collection(db, "global_community_itineraries", selectedCountry, "Itineraries");
        const communityItinerariesSnapshot = await getDocs(itinerariesRef);

        // Use 'Promise.all' to wait for all async operations within 'map' to complete.
        const itinerariesWithUsersPromises = communityItinerariesSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          if (docSnap.exists()) {
            const userId = data.userId;
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              console.log("userData", userData);
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
            }
          }
          return null; // Return null for documents that don't exist or have no user data.
        });

        // Filter out any nulls after all promises resolve.
        const itinerariesWithUsers = await Promise.all(itinerariesWithUsersPromises);
        this.itineraries = itinerariesWithUsers.filter(itinerary => itinerary !== null);
        console.log("Fetch success");
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    }

  },
  created() {
    if (this.country) {
      this.fetchItineraries(this.country);
    }
  },
  showItinerary(itinerary) {
    this.$emit('show-itinerary', itinerary);
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
