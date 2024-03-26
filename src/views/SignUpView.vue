<template>
  <div class = "signup-view">
    <div class = "content">
      <BackToHome />
      <SignUpForm />
    </div>
  </div>
</template>

<script>
import BackToHome from "@/components/BackToHome.vue";
import SignUpForm from "@/components/SignUpForm.vue";
export default {
  name: "SignUpView",
  components: {
    BackToHome,
    SignUpForm,
  }
}
</script>

<style scoped>
.signup-view {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: url('../assets/login_leftpic.png') ;
  background-size: cover;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  
}

.content {
  background-color: rgba(231, 219, 220, 0.8);
  width: max-content;
  text-align: center;
  padding: 40px 20px;
  border-radius: 20px;
}
</style>