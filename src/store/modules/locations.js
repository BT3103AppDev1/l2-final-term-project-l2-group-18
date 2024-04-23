const locationsModule = {
  namespaced: true,
  state: {
    locations: [],
    selectedLocations: null,
    tempLocation: null,
  },

  mutations: {
    CLEAR_LOCATIONS(state) {
      state.locations = [];
    },

    SET_LOCATIONS(state, locations_payload) {
      state.locations = [...locations_payload];
    },

    SET_SELECTED_LOCATION(state, location) {
      console.log("Setting selected location:", location);
      state.selectedLocation = location;
    },

    SET_TEMP_LOCATION(state, location) {
      state.tempLocation = location;
    },
  },

  actions: {
    updateLocations({ commit }, locations) {
      commit("CLEAR_LOCATIONS");
      commit("SET_LOCATIONS", locations);
    },

    selectLocation({ commit }, location) {
      commit("SET_SELECTED_LOCATION", null);
      setTimeout(() => {
        commit("SET_SELECTED_LOCATION", location);
      }, 0); // setTimeout with 0 delay is similar to Vue.nextTick()
    },

    updateTempLocation({ commit }, location) {
      commit("SET_TEMP_LOCATION", location);
    },

    clearTempLocation({ commit }) {
      commit("SET_TEMP_LOCATION", null);
    },
  },

  getters: {
    allLocations(state) {
      console.log("in allLocations, printing locations in store");
      console.log(state.locations);
      return state.locations;
    },

    selectedLocation(state) {
      console.log("Selected location in getter:", state.selectedLocation);
      return state.selectedLocation;
    },

    tempLocation(state) {
      return state.tempLocation;
    },
  },
};

export default locationsModule;
