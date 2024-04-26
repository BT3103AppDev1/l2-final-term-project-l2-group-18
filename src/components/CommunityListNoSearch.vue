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
    itineraryId: String,
    // vote: Integer,

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
      const userRef = doc(db, "global_user_itineraries", itineraryId);
      const userSnap = await getDoc(userRef);
      const itineraryData = userSnap.data();
      const location = itineraryData.destination;
      const itineraryRef = doc(db, "global_community_itineraries", location, "Itineraries", itineraryId);

      try {
        await runTransaction(db, async (transaction) => {
          const userVoteRef = doc(itineraryRef, "userVotes", userId);
          const userVoteDoc = await transaction.get(userVoteRef);

          const voteStatus = doc(itineraryRef, "userVotes", userId); // either 0, 1, -1
          const voteSnap = await getDoc(voteStatus);
          const voteData = voteSnap.data()
          const vote = voteData.vote;
          console.log("user current vote:", vote)

          // Determine the current user's vote state
          const voteChange = isUpvote ? 1 : -1;
          console.log("vote change: ", voteChange)
          let currentVote = userVoteDoc.exists() ? userVoteDoc.data().vote : 0;
          console.log("Document exists:", userVoteDoc.exists());
          console.log("Document data:", userVoteDoc.data());
          if (userVoteDoc.exists()) {
            console.log("Vote value:", userVoteDoc.data().vote);
          }
          console.log("current vote:", currentVote)
          let newVote = 0;

          if (currentVote === voteChange) { // voteChange is either 1 or -1
            // User is trying to vote the same way again
            throw new Error('You cannot vote more than once.');
          } else if (currentVote === 0) {
            // This is the user's first time voting
            console.log("inside else if (currentVote === 0)")
            newVote = voteChange;
          } else {
            console.log("inside else")

            // User is changing their vote or retracting it
            newVote = (currentVote === -voteChange) ? 0 : voteChange;
            console.log(newVote)

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
      this.$emit('show-itinerary', itinerary);
    },
    async fetchItineraries() {
      const db = getFirestore();
      try {
        const countriesRef = collection(db, "global_community_itineraries");
        const countriesSnapshot = await getDocs(countriesRef);
        const itinerariesNew = [];
        for (const countryDoc of countriesSnapshot.docs) {
          const itinerariesRef = collection(countryDoc.ref, "Itineraries");
          const itinerariesSnapshot = await getDocs(itinerariesRef);
          const fetchedItineraries = await Promise.all(itinerariesSnapshot.docs.map(async document => {
            const data = document.data();
            const userId = data.userId;
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};
            return {
              id: document.id,
              title: data.title,
              destination: data.destination,
              startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString("en-GB"),
              endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString("en-GB"),
              votes: data.votes,
              imageURL: data.imageURL,
              photoURL: userData.photoURL || '',
              username: userData.username || 'Unknown'
            };
          }));
          itinerariesNew.push(...fetchedItineraries);
        }
        const sortedItineraries = itinerariesNew.sort((a, b) => b.votes - a.votes);
        this.itineraries = sortedItineraries;
        console.log("All itineraries fetched:", this.itineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    },

  },
  mounted() {
    this.fetchItineraries();
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