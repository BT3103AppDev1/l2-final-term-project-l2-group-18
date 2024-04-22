<template>
    <div class="trips container">
        <h1 class="section-title">Explore the world</h1>
        <h2>Trending Places</h2>
        <div class="tours-container">
            <ExploreCard
                v-for="tour in tours"
                :key="tour.id"
                :name="tour.name"
                :imageURL="tour.imageURL"
                @viewCity="handleViewCity" />
        </div>
    </div>
</template>

<script>
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import ExploreCard from './ExploreCard.vue';

export default {
    components: {
        ExploreCard
    },
    data() {
        return {
            tours: [
            ]
        };
    },
    methods: {
        handleViewCity(cityName) {
            console.log('Viewing city:', cityName);
        },
        async fetchTours() {
            const db = getFirestore();
            const countryCollection = collection(db, "global_community_itineraries");
            try {
                const querySnapshot = await getDocs(query(countryCollection, limit(6)));
                this.tours = querySnapshot.docs.map(doc => ({
                    name: doc.id,
                    imageURL: doc.data().imageURL
                }));
            } catch(error) {
                console.error("Error fetching tours:", error);
            }
        }
    },
    created() {
        this.fetchTours();
    }

}
</script>

<style>
.explore-section{
    position: relative;
    width: 100%;
    padding: 80px 10vw;
    color: #fff;
}

.section-title{
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    text-transform: capitalize;
}

.section-para{
    width: 50%;
    min-width: 300px;
    display: block;
    margin: 30px auto;
    text-align: center;
    line-height: 25px;
    opacity: 0.6;
}

.tours-container{
    position: relative;
    width: 100%;
    height: 500px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 10px;
}

.tour-card:nth-child(2){
    grid-row: span 2;
}

.tour-card:last-child{
    grid-column: span 2;
}

</style>