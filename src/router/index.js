import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignUpView from "../views/SignUpView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ItinerariesView from "../views/ItinerariesView.vue";
import LandingView from "../views/LandingView.vue";

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
      path: "/itineraries",
      name: "Itineraries",
      component: ItinerariesView,
    },
  ],
});

export default router;
