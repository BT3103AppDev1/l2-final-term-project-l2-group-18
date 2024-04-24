<template>
    <div class ="trips container">
        <div class="cards">
            <itinerary-card
                v-for="itinerary in displayedItineraries"
                :id="itinerary.id"
                :title="itinerary.title"
                :destination="itinerary.destination"
                :itineraryPic="itinerary.imageURL"
                :selected="itinerary.selected"
                :startDate="itinerary.startDate"
                :endDate="itinerary.endDate" />
        </div>
    </div>
</template>

<script>
import ItineraryCard from './ItineraryCard.vue';
import {mapGetters, mapActions } from "vuex";
import { doc, getDoc, getDocs, addDoc, getFirestore, collection, QuerySnapshot, onSnapshot } from "firebase/firestore";

export default {
    components: {
        ItineraryCard
    },
    props: {
        limit: {
            type: Number,
            default: Infinity
        }
    },
    computed: {
      ...mapGetters('user', ['userData', 'userUID']),
      displayedItineraries() {
        return this.itineraries.slice(0, this.limit);
      }
    },
    data() {
        return {
            itineraries: [

            ]
        }
    },
    methods: {
        // Deprecated
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
                    const options = {year : 'numeric', month: 'short', day: '2-digit'};
                    return {
                        id: docSnap.id,
                        startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString('en-GB', options),
                        endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString('en-GB', options),
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

        setupPersonalItinerariesListener() {
            const userId = this.userUID;
            const itinerariesRef = collection(getFirestore(), "users", userId, "itineraries");
            onSnapshot(itinerariesRef, async (snapshot) => {
                const itineraryPromises = snapshot.docs.map((document) =>
                    doc(getFirestore(), "global_user_itineraries", document.id)
                );
                const itineraryDocs = await Promise.all(itineraryPromises.map(ref => getDoc(ref)));
                this.itineraries = itineraryDocs.map(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const options = { year: 'numeric', month: 'short', day: '2-digit' };
                        return {
                            id: docSnap.id,
                            startDate: new Date(data.dateRange[0].seconds * 1000).toLocaleDateString('en-GB', options),
                            endDate: new Date(data.dateRange[1].seconds * 1000).toLocaleDateString('en-GB', options),
                            destination: data.destination,
                            imageURL: data.imageURL,
                            title: data.title
                        };
                    } else {
                        console.log("No document!");
                        return null;
                    }
                }).filter(itinerary => itinerary !== null);
            });
        },
    },
    created() {
        this.setupPersonalItinerariesListener();
    }
}
</script>

<style scoped>
.trips.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>