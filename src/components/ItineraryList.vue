<template>
    <div class ="trips container">
        <h1>Your Trips</h1>
        <div class="cards">
            <itinerary-card
                v-for="itinerary in itineraries" 
                :key="itinerary.id"     
                :itinerary="itinerary" />
        </div>
    </div>
</template>

<script>
import ItineraryCard from './ItineraryCard.vue';
import {mapGetters, mapActions } from "vuex";
import { doc, setDoc, getDocs, addDoc, getFirestore, collection, QuerySnapshot } from "firebase/firestore";

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
                this.itineraries = myItineraries.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        date:data.dateRange,
                        destination: data.destination,
                        imageURL: data.imageURL,
                    };
                });
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

<style>

</style>