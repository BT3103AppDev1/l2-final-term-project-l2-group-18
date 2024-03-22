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
            <select v-model="selectedLocation">
            <option value="">Select Location</option>
            <option value="Singapore">Singapore</option>
            <option value="Japan">Japan</option>
            <option value="Malaysia">Malaysia</option>
            </select>
            <button @click="search">Search</button>
        </div>

        <div class="results">
        <div v-if="selectedLocation === 'Singapore'" class="country-info">
          <div class="colored-box singapore">
            <img class="mainpic" src="../assets/community_singapore1.jpeg" alt="Marina" />
            <h3>City life</h3>
            <div class="profile-info">
                <img class="profile-img" src="../assets/community_singapore2.jpeg" alt="Matcha Overload" />
                <p class="profile-name">Darrell</p>
                <div class="upvote-downvote">
                    <button @click="upvote(selectedLocation)">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <span>{{ upvotes['Singapore'] }}</span>
                    <button @click="downvote(selectedLocation)">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                </div>
            </div>
          </div>
        </div>
        <div v-if="selectedLocation === 'Japan'" class="country-info">
          <div class="colored-box japan">
            <img class="mainpic" src="../assets/community_japan2.jpeg" alt="Matcha Girl" />
            <h3>Matcha Overload</h3>
            <div class="profile-info">
                <img class="profile-img" src="../assets/community_japan1.jpeg" alt="Matcha Overload" />
                <p class="profile-name">Vivian</p>
                <div class="upvote-downvote">
                    <button @click="upvote(selectedLocation)">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <span>{{ upvotes['Japan'] }}</span>
                    <button @click="downvote(selectedLocation)">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                </div>
            </div>
          </div>
        </div>
        <div v-if="selectedLocation === 'Malaysia'" class="country-info">
            <div class="colored-box malaysia">
            <img class="mainpic" src="../assets/community_malaysia2.webp" alt="Marina" />
            <h3>Malaysia Guide</h3>
            <div class="profile-info">
                <img class="profile-img" src="../assets/community_malaysia1.jpeg" alt="Matcha Overload" />
                <p class="profile-name">Marcel</p>
                <div class="upvote-downvote">
                    <button @click="upvote(selectedLocation)">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <span>{{ upvotes['Malaysia'] }}</span>
                    <button @click="downvote(selectedLocation)">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "CommunityView",
  components: {
    NavBar,
  },
  data() {
    return {
      selectedLocation: '',
      upvotes: {
        'Singapore': 0,
        'Japan': 0,
        'Malaysia': 0
      }
    };
  },
  methods: {
    search() {
      // Implement search functionality here
      // You can fetch search results from an API or perform client-side filtering
      // Use this.selectedLocation to get the selected location
    },
    upvote(location) {
      // Increment upvotes count for the given location
      this.upvotes[location]++;
    },
    downvote(location) {
      // Decrement upvotes count for the given location
      // Add logic to prevent negative votes if needed
      if (this.upvotes[location] > 0) {
        this.upvotes[location]--;
    }
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

.colored-box {
  padding: 20px;
  border-radius: 8px;
  margin-right: 20px;
  width: 300px;
  position: relative; /* Position the upvote-downvote div relative to this */
  overflow: hidden; /* Prevent upvote-downvote div from overflowing */
  /* Added styles */
  position: relative;
}

.singapore {
  background-color: rgb(240, 167, 167);
}

.japan {
  background-color: rgb(240, 167, 167);
}

.malaysia {
  background-color: rgb(240, 167, 167);
}

.colored-box h3 {
  margin-bottom: 10px;
  color: black;
}

.colored-box p {
  color: black;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.profile-name {
  margin-bottom: 100;
  margin-left: 10px;
}

.mainpic {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.upvote-downvote {
  position: absolute;
  bottom: 7%;
  right: 0;
  display: flex;
  flex-direction: column;
}

.upvote-downvote button {
  background: none;
  border: none;
  cursor: pointer;
}

.upvote-downvote button i {
  color: #28a745;
}

.upvote-downvote button i.fa-arrow-down {
  margin-top: 5px;
  color: #dc3545;
}
</style>
