<template>
  <div class="search-bar">
    <input type="text" v-model="searchQuery" @input="filterCountries" placeholder="Search...">
    <div v-if="filteredCountries.length > 0" class="dropdown">
      <ul>
        <li v-for="country in filteredCountries" :key="country.code" @click="selectCountry(country)">
          {{ country.name }}
        </li>
      </ul>
    </div>
    <button type="submit" class="submit-btn" @click="submitSearch">
      <img src="/src/assets/HTLVlogo.png" alt="Plan" class="submit-icon" />
    </button>
  </div>
</template>

<script>
import { countries } from 'countries-list';

export default {
  name: 'CommunitySearch',
  data() {
    return {
      searchQuery: '',
      filteredCountries: [],
      selectedCountry: null
    };
  },
  methods: {
    filterCountries() {
      this.filteredCountries = Object.values(countries).filter(country => {
        return country.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    selectCountry(country) {
      this.searchQuery = country.name;
      this.selectedCountry = country;
      this.filteredCountries = []; 
    },
    submitSearch() {
      this.$emit('submit', this.selectedCountry);
    }
  }
};
</script>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: 20px;
  margin-left: 100px;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 4px;
  width: 300px;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}

.submit-btn {
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 10px;
}

.submit-icon {
  height: 24px;
}
</style>
