const locationsModule = {
  namespaced: true,
  state: {
    locations: [],
  },
  mutations: {
    CLEAR_LOCATIONS(state) {
        state.locations = [];
    },
    SET_LOCATIONS(state, locations_payload) {
        state.locations = [...locations_payload];
    },
  },
  actions: {
    // instead of mutating the state, actions commit mutations
    // async operations, API calls, calculations etc... before commiting mutations that modify the state
    updateLocations({ commit }, locations) {
        commit("CLEAR_LOCATIONS");
        commit("SET_LOCATIONS", locations);

    },
  },
  getters: {
    allLocations(state) {
        console.log("in allLocations, printing locations in store")
        console.log(state.locations)
      return state.locations;
    },
  },
};

export default locationsModule;
