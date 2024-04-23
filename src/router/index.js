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
    },
    {
      path: "/itineraries/:itineraryId",
      name: "Itineraries",
      component: ItinerariesView,
      props:true,
    },
    {
      path: "/community/:selectedCountryProp?",
      name: "Community",
      component: CommunityView,
      props:true,
    },
    {
      path: "/about",
      name: "About",
      component: AboutView,
    },    
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
    },
    {
      path: "/global-itineraries/:itineraryId",
      name: "GlobalItineraries",
      component: GlobalItinerariesView,
      props: true,
    },
  ],
});

export default router;
