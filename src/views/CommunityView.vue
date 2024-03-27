<template>
  <div class="community-view">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <NavBar />
    <div class="content">
      <div class="trending-info">
        <h2>Trending Placelists in your city</h2>
        <p>See where others love to go!</p>
      </div>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search...">
        <button @click="search">Search</button>
      </div>

      <div v-if="selectedLocation === 'Singapore'">
        <ItinerariesBox
          profilePic="src/assets/community_singapore2.jpeg"
          name="Darrell"
          title="City life"
          itineraryPic="src/assets/community_singapore1.jpeg"
        />
      </div>

      <div v-if="selectedLocation === 'Malaysia'">
        <ItinerariesBox
          profilePic="src/assets/community_malaysia1.jpeg"
          name="Marcel"
          title="Nature adventures"
          itineraryPic="src/assets/community_malaysia2.jpeg"
        />
      </div>

      <div v-if="selectedLocation === 'Japan'">
        <ItinerariesBox
          profilePic="src/assets/community_japan2.jpeg"
          name="Vivian"
          title="Cultural experience"
          itineraryPic="src/assets/community_japan1.jpeg"
        />
      </div>

    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import ItinerariesBox from "../components/ItinerariesBox.vue";

export default {
  name: "CommunityView",
  components: {
    NavBar,
    ItinerariesBox
  },
  data() {
    return {
      searchQuery: "",
      selectedLocation: null,
      itineraries: [
        {
          location: "Singapore",
          profilePic: "src/assets/community_singapore2.jpeg",
          name: "Darrell",
          title: "City life",
          itineraryPic: "src/assets/community_singapore1.jpeg"
        },
        {
          location: "Malaysia",
          profilePic: "src/assets/community_malaysia2.jpeg",
          name: "Marcel",
          title: "Nature adventures",
          itineraryPic: "src/assets/community_malaysia1.jpeg"
        },
        {
          location: "Japan",
          profilePic: "src/assets/community_japan2.jpeg",
          name: "Vivian",
          title: "Matcha Overload",
          itineraryPic: "src/assets/community_japan1.jpeg"
        }
      ]
    };
  },
  methods: {
    search() {
    const normalizedQuery = this.searchQuery.toLowerCase();
    const found = this.itineraries.find(item => item.location.toLowerCase() === normalizedQuery);
    this.selectedLocation = found ? found.location : null;
    },
    upvote(location) {
      console.log(`Upvoted ${location}`);
    },
    downvote(location) {
      console.log(`Downvoted ${location}`);
    }
  }
};
</script>

<style scoped>
.community-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  text-align: left;
  margin-bottom: 2rem;
  width: 100%;
}

.trending-info {
  margin-bottom: 20px;
  margin-left: 100px;
}

.search-bar {
  margin-bottom: 20px;
  margin-left: 100px;
}

.search-bar select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  margin-left: 100px;
}

.search-bar button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.results {
  display: flex;
  justify-content: center;
}

.country-info {
  margin-top: 20px;
}
</style>
