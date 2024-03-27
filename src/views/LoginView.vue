<template>
  <div class = "login-view">
    <div class = "combined_login">
      <BackToHome />
      <LoginForm />
    </div>
  </div>
</template>

<script>
import BackToHome from "@/components/BackToHome.vue"
import LoginForm from "@/components/LoginForm.vue"
export default {
  name: "LoginView",
  components: {
    BackToHome,
    LoginForm
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: url('../assets/login_leftpic.png') ;
  background-size: cover;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

.combined_login {
  background-color: rgba(231, 219, 220, 0.8);
  width: max-content;
  text-align: center;
  padding: 40px 20px;
  border-radius: 20px;
}

</style>