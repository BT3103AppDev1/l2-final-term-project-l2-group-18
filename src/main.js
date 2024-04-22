import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from './store/store.js'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import '@fortawesome/fontawesome-free/css/all.css';
import { faUserCircle, faHome, faEnvelope, faUpload, faEdit, faUser, faSignOutAlt, faUsers, faGlobe, faStar} from '@fortawesome/free-solid-svg-icons';


library.add(faShareFromSquare, faCalendar, faHome, faUserCircle, faEnvelope, faUpload, faEdit, faUser, faSignOutAlt, faUsers, faGlobe, faStar);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(store);
app.use(router).mount("#app");
