<template>
  <div class="community-view">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <NavBar />
    <div class="content">
      <div class="trending-info">
        <h2>Trending Placelists in your City</h2>
        <p>See where others love to go!</p>
      </div>
      <CommunitySearch @submit="updateSelectedCountry" />
      <CommunityListNoSearch v-if="!selectedCountry"/>
      <CommunityList
        v-if="selectedCountry"
        :country="selectedCountry"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import CommunitySearch from "../components/CommunitySearch.vue";
import CommunityList from "../components/CommunityList.vue";
import FixedCommunity from "../components/FixedCommunity.vue";
import CommunityListNoSearch from "@/components/CommunityListNoSearch.vue";

export default {
  name: "CommunityView",
  props: ["selectedCountryProp"],
  components: {
    NavBar,
    CommunitySearch,
    CommunityList,
    FixedCommunity,
    CommunityListNoSearch
  },
    data() {
    return {
      selectedCountry: this.selectedCountryProp ? this.selectedCountryProp : null,
      itineraries: [],
      selectedItinerary: null
    };
  },
  methods: {
    updateSelectedCountry(country) {
      console.log("updated", country.name);
      this.selectedCountry = country.name;
    }
  },
  mounted() {
    console.log("selectedCountryProp received:", this.selectedCountryProp);
    document.body.style.backgroundColor = "#e7dcdc";
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

.results {
  display: flex;
  justify-content: center;
}

.country-info {
  margin-top: 20px;
}
</style>
