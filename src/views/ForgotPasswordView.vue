<template>
    <div class = "signup-view">
      <div class = "content">
        <BackToHome />
        <ForgetPasswordForm />
      </div>
    </div>
</template>
  
<script>
  import BackToHome from "@/components/BackToHome.vue";
  import ForgetPasswordForm from "@/components/ForgotPasswordForm.vue";
  export default {
    name: "ForgotPasswordView",
    components: {
      BackToHome,
      ForgetPasswordForm,
    },
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
  padding: 30px 20px;
  border-radius: 20px;
}
</style>