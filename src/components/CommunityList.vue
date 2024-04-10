<template>
  <div class="trips container">
    <div class="cards">
      <CommunityCard
        v-for="itinerary in itineraries"
        :itineraryId="itinerary.id"
        :country="itinerary.destination"
        :title="itinerary.title"
        :itineraryPic="itinerary.imageURL"
        :profilePic="itinerary.photoURL"
        :name="itinerary.username"
      />
    </div>
  </div>
</template>

<script>
import CommunityCard from "./CommunityCard.vue";
import { mapGetters, mapActions } from "vuex";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  getFirestore,
  collection,
  QuerySnapshot,
} from "firebase/firestore";
import { handleError } from "vue";

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
    async fetchItineraries(selectedCountry) {
      const db = getFirestore();
      try {
        console.log(selectedCountry);
        const itinerariesRef = collection(
          db,
          "global_community_itineraries",
          selectedCountry,
          "Itineraries"
        );
        const communityItineraries = await getDocs(itinerariesRef);
        const itinerariesWithUsers = communityItineraries.docs
          .map(async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const userId = data.userId;
              console.log("User ID:", data.user);
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.data();
              console.log(userData);
              return {
                id: docSnap.id,
                destination: data.destination,
                imageURL: data.imageURL,
                title: data.title,
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
