<template>
  <PlacesSearchBar @place-selected="handlePlaceSelection" />
  <div class="places-container">
    <div class="header-container">
      <h1>Places to Visit</h1>
      <div class="share-button-container">
        <font-awesome-icon
          icon="share-from-square"
          class="fa-regular share-icon"
          :size="iconSize"
        />
        <button class="new-day-button" @click="addNewDay">Add New Day</button>
      </div>
    </div>
    <div class="days-container" v-for="(day, index) in days" :key="index">
      <div class="days-title-container">
        <font-awesome-icon
          icon="calendar"
          class="fa-regular calendar-icon"
          :size="iconSize"
        />
        <h2>Day {{ day }}</h2>
        <button
          v-if="index === days.length - 1 && days.length !== 1"
          class="delete-day-button"
          @click="deleteDay(index)"
        >
          Delete Day
        </button>
      </div>

      <div class="location-container">
        <div
          class="location-details"
          v-for="item in filteredMockData(day)"
          :key="item"
        >
          <div class="location-header">
            <h3>{{ item.location }}</h3>
            <div>
              <span
                class="location-category"
                :style="{ backgroundColor: getCategoryColor(item.category) }"
                >{{ item.category }}</span
              >
              <button class="minus-button">-</button>
            </div>
          </div>
          <span class="location-description">{{ item.description }}</span>
        </div>
        <div class="add-location-container">
          <button class="plus-button" @click="showAddLocationForm = day">
            +
          </button>
          <span class="add-location">Add Location</span>
        </div>
      </div>
    </div>

    <div
      class="add-location-form"
      :class="{ open: showAddLocationForm !== null }"
    >
      <AddLocationForm
        @closeForm="showAddLocationForm = null"
        v-if="showAddLocationForm !== null"
        :dayNumber="showAddLocationForm"
      />
    </div>
  </div>
</template>

<script>
import AddLocationForm from "./AddLocationForm.vue";
import PlacesSearchBar from "./PlacesSearchBar.vue"

export default {
  mounted() {
    document.body.style.backgroundColor = "#e7dcdc";
    this.days = [...new Set(this.mockData.map((item) => item.day))];
  },

  beforeDestroy() {
    // Reset the background color when the component is destroyed
    document.body.style.backgroundColor = "";
  },

  data() {
    return {
      showAddLocationForm: null,
      iconSize: "xl",
      days: [],
      mockData: [
        {
          day: 1,
          location: "Marina Bay Sands",
          description:
            "Integrated resort (IR) with a hotel, casino, retail mall, as well as convention facilities and entertainment venues including theatres, nightclubs and a museum.",
          category: "Hotel",
        },
        {
          day: 1,
          location: "Gardens by the Bay",
          description:
            "Gardens by the Bay is a huge, colourful, futuristic park in the bay area of Singapore. Among the standout features are the famous Supertree structures. These offer an impressive skywalk over the gardens, with oversized seashell-shaped greenhouses that recreate chilly mountain climates.",
          category: "Nature",
        },
        {
          day: 2,
          location: "PocoLoco",
          description: "Best Italian restaurant in Singapore",
          category: "Food",
        },
        {
          day: 2,
          location: "Atlas",
          description:
            "Luxurious 1920s-inspired venue for European cuisine, afternoon tea & cocktails, plus art deco decor.",
          category: "Bar",
        },
        {
          day: 2,
          location: "Skyline Luge Sentosa",
          description:
            "Skyline Luge Singapore offers 4 purpose-built tracks with hairpin corners, exhilarating tunnels and downhill slopes through a rainforest with mystical creatures, which can be enjoyed during the day or night! It's the ultimate fun day out for the whole family.",
          category: "Adventure",
        },
        {
          day: 2,
          location: "Merlion Park",
          description:
            "The Merlion is the official mascot of Singapore. It is depicted as a mythical creature with the head of a lion and the body of a fish.",
          category: "Sightseeing",
        },
        {
          day: 3,
          location: "ION Orchard",
          description:
            "ION Orchard is a stylish architectural wonder, glowing like a futuristic beacon at the end of Orchard Road - enticing fashionistas and luxury shoppers inside.",
          category: "Shopping",
        },
        {
          day: 3,
          location: "Sri Mariamman Temple",
          description:
            "The oldest Hindu temple in Singapore, Sri Mariamman Temple serves as a focal point for the Hindu community, and is dedicated to Goddess Mariamman, known for her powers in curing epidemic illnesses.",
          category: "Religious Site",
        },
        {
          day: 3,
          location: "ABC Cooking Studio",
          description:
            "ABC Cooking Studio, which hails from Japan, is one of the country's top culinary schools. With four outlets in Singapore, the classes teach you to master the art of Japanese cuisine, from takoyaki to tempura to tonkatsu.",
          category: "Others",
        },
      ],
    };
  },

  methods: {
    addNewDay() {
      this.days.push(this.days.length + 1);
    },
    deleteDay(index) {
      // add code to delete data from firebase with itineraries in the same day
      this.days.splice(index, 1);
    },
    filteredMockData(dayNumber) {
      return this.mockData.filter((item) => item.day === dayNumber);
    },
    getCategoryColor(category) {
      // Define colors for different categories
      const categoryColors = {
        Food: "#FF6B6B",
        Bar: "#F28E1C",
        Adventure: "#593233",
        Hotel: "#4E7FE0",
        Nature: "#4EE0A3",
        Sightseeing: "#854DDC",
        Shopping: "#92B1B6",
        "Religious Site": "#DFBD69",
        Others: "#808080",
      };
      // Return the color for the specified category
      return categoryColors[category];
    },
    handlePlaceSelection(place) {
      this.$emit("place-selected", place);
    }
  },

  components: {
    AddLocationForm,
    PlacesSearchBar
  },
};
</script>

<style scoped>
.places-container {
  padding-left: 3rem;
  padding-right: 3rem;
}

.header-container {
  display: flex;
  align-items: center;
}

h1 {
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.share-button-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.share-icon {
  margin-right: 1rem;
}

.new-day-button {
  width: 120px;
  padding: 0.5rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.days-container {
  margin-bottom: 1rem;
}

.days-title-container {
  padding-left: 1rem;
  display: flex;
  align-items: center;
}

h2 {
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.calendar-icon {
  margin-right: 1rem;
}

.delete-day-button {
  width: 100px;
  padding: 0.5rem;
  margin-left: 2rem;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.location-container {
  padding-left: 2rem;
  align-items: center;
}

.location-details {
  background-color: rgba(128, 128, 128, 0.25);
  border-radius: 10px;
  text-align: left;
  padding: 1rem;
  margin-bottom: 1rem;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 0;
}

.location-category {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  font-size: 14px;
  border-radius: 10px;
  color: white;
}

.minus-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #808080;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
}

.add-location-container {
  padding-left: 2rem;
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.plus-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff5b5b;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
}

.add-location {
  color: #808080;
}

.add-location-form {
  position: fixed;
  top: 0;
  right: -50%; /* Sidebar starts off-screen */
  width: 50%;
  height: 100%;
  background-color: #fff;
  transition: right 0.3s ease; /* Transition effect */
  z-index: 1000; /* Ensure sidebar is above other content */
}

.add-location-form.open {
  right: 0; /* Slide sidebar into view */
}
</style>
