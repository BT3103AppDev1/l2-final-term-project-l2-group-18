<template>
  <NavBar /> 
  <div>
    <PlacesToVisit />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue"
import PlacesToVisit from "@/components/PlacesToVisit.vue";
export default {
  name: "Itineraries",
  components: {
    PlacesToVisit,
    NavBar
  },
};
</script>

<style scoped></style>
