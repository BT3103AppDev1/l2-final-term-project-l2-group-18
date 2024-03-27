<template>
    <div class = "header">
        <a href = "/">
            <img src = "/src/assets/HTLVlogo.png" alt = "Logo" class = "logo"/>
        </a>
    </div>
</template>

<script>
export default {
    name: "Logo",
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}

.logo{
    width:auto;
    height: 150px;
    padding: 0%;
    margin: 0%;
}
</style>