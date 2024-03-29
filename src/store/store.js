import { createStore } from 'vuex';
import user from './modules/user';
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
    key: "my-app",
    storage: window.localStorage,
});

const store = createStore({
    modules: {
        user
    },
    plugins: [vuexPersist.plugin]
});

export default store;
