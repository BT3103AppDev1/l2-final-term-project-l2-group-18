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
          
          if (userVoteDoc.data().voted == false) {
            transaction.set(userVoteRef, { voted: true });
            transaction.update(itineraryRef, {
              votes: increment(isUpvote ? 1 : -1)
            });
            alert('Vote successful!');
          } else {
            throw new Error('You have already voted!');
          }
        });
        console.log('Transaction successfully committed!');
        this.fetchItineraries();
      } catch (error) {
        console.error('Transaction failed: ', error);
        if (error.message === 'You have already voted!') {
          alert(error.message);
        }
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
          itinerariesSnapshot.forEach(async document => {
            const data = document.data();
            const userId = data.userId;
            console.log(userId);
            const userRef = doc(db, "users", userId);
            console.log(userRef);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            console.log(userData);
            const formattedItinerary = {
              id: document.id,
              title: data.title,
              destination: data.destination,
              startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString("en-GB"),
              endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString("en-GB"),
              votes: data.votes,
              imageURL: data.imageURL,
              photoURL: userData.photoURL,
              username: userData.username
};
            if (!itinerariesNew.some(itinerary => itinerary.id === formattedItinerary.id)) {
              itinerariesNew.push(formattedItinerary);
            }
          });
        }
        this.itineraries = itinerariesNew;
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