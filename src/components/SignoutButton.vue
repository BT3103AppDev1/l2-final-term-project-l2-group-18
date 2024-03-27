<template>
  <button @click="submitSignOut" class="sign-out-button">Sign Out</button>
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
  padding: 5px 10px;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sign-out-button:hover {
  background-color: #ff2c3b;
}
</style>
