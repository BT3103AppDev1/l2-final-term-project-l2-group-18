<template>
  <button @click="submitSignOut" class="sign-out-button"> <font-awesome-icon icon="sign-out-alt" /> Sign Out</button>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SignOutButton",
  methods: {
    ...mapActions("user", ["signOut"]),
    async submitSignOut() {
        await this.signOut();
        this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.sign-out-button {
  margin-left: 15px;
  background-color: #e0e0e0;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: auto;
  height: fit-content;
  margin-bottom: 1px;
  margin-top: 1px;
  font-size: 13px;
  padding: 3px;
  text-decoration: none;
  text-align: center;
}

.sign-out-button:hover {
  background-color: #FF5A5F;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}
</style>
