import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignUpView from "../views/SignUpView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ItinerariesView from "../views/ItinerariesView.vue";
import CommunityView from "../views/CommunityView.vue";
import LandingView from "../views/LandingView.vue";
import AboutView from "../views/AboutView.vue";
import ProfileView from "../views/ProfileView.vue";
import MyItinerariesView from "@/views/MyItinerariesView.vue";
import GlobalItinerariesView from "@/views/GlobalItinerariesView.vue";
import store from '../store/store.js';  // Adjust the path as necessary


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Landing",
      component: LandingView,
    },
    {
      path: "/home",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUpView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/forgot-password",
      name: "ForgetPassword",
      component: ForgotPasswordView,
    },
    {
      path: "/my-itineraries",
      name: "MyItineraries",
      component: MyItinerariesView,
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: "/itineraries/:itineraryId",
      name: "Itineraries",
      component: ItinerariesView,
      props:true,
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: "/community/:selectedCountryProp?",
      name: "Community",
      component: CommunityView,
      props:true,
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: "/about",
      name: "About",
      component: AboutView,
      meta: { requiresAuth: true }  // Protected route
    },    
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: "/global-itineraries/:itineraryId",
      name: "GlobalItineraries",
      component: GlobalItinerariesView,
      props: true,
      meta: { requiresAuth: true }  // Protected route
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.state.user.loggedIn;  // Access the loggedIn state from Vuex
  console.log("")

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });  // Redirect to the login page
  } else {
    next();  // Proceed as normal if authenticated or route does not require auth
  }
});

export default router;
