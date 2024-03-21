<template>
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import "./firebaseConfig.js";
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh; /* 100% of the viewport height */
  width: 100vw;
  max-width: 100%; /* Ensure the container does not exceed the screen width */
  overflow-x: hidden;
}
#nav {
  padding: 30px;
  width: 100%;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: underline;
}
#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
