const locationsModule = {
  namespaced: true,
  state: {
    locations: [],
    selectedLocations: null,
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
  },
  actions: {
    // instead of mutating the state, actions commit mutations
    // async operations, API calls, calculations etc... before commiting mutations that modify the state
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
  },
};

export default locationsModule;
