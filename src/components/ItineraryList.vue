<template>
    <div class ="trips container">
        <h1>Your Trips</h1>
        <div class="cards">
            <itinerary-card
                v-for="itinerary in itineraries"
                :key="itinerary.id"
                :title="itinerary.destination"
                :itineraryPic="itinerary.imageURL"
                :profilePic="itinerary.profilePic"
                :name="itinerary.name"
                :selected="itinerary.selected" />
        </div>
    </div>
</template>

<script>
import ItineraryCard from './ItineraryCard.vue';
import {mapGetters, mapActions } from "vuex";
import { doc, getDoc, getDocs, addDoc, getFirestore, collection, QuerySnapshot } from "firebase/firestore";

export default {
    components: {
        ItineraryCard
    },
    props: {
        type: String
    },
    computed: {
      ...mapGetters('user', ['userData', 'userUID'])
    },
    data() {
        return {
            itineraries: [
                
            ]
        }
    },
    methods: {
        fetchItineraries() {
            if (this.type == "personal") {
                this.fetchPersonalItineraries();
            } else {
                this.fetchCommunityItineraries();
            }
        },
        async fetchPersonalItineraries() {
            const userId = this.userUID;
            try {
                const itinerariesRef = collection(getFirestore(), "users", userId, "itineraries")
                const myItineraries = await getDocs(itinerariesRef);
                const itineraryIds = myItineraries.docs.map((doc) => doc.id);
                const itinerariesDocs = await Promise.all(itineraryIds.map(id =>
                    getDoc(doc(getFirestore(), "global_user_itineraries", id)))
                );
                this.itineraries = itinerariesDocs.map(docSnap => {
                    if (docSnap.exists()) {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        date: data.dateRange,
                        destination: data.destination,
                        imageURL: data.imageURL,
                        title: data.title
                    };
                } else {
                    console.log("No document!");
                    return null;
                }
            }).filter(itinerary => itinerary !== null);

            console.log("Fetch success");
            } catch (error) {
                console.error("Error fetching itineraries:", error);
            }
        },
        fetchCommunityItineraries() {

        }
    },
    created() {
        this.fetchItineraries();
    }
}
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
  gap: 20px; /* Adds space between the cards */
}
</style>