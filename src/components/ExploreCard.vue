<template>
    <div class="tour-card" @click="viewCity">
        <img :src="imageURL" class="tour-img" :alt="name" />
        <div class="tour-body">
            <h3 class="tour-name">{{ name }}</h3>
            <p class="tour-action">View city</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        imageURL: String
    },
    methods: {
        viewCity() {
            console.log(this.name);
            this.$router.push({name: 'Community', params: {selectedCountryProp: this.name}} );
        }
    }
}
</script>

<style scoped>
.tour-card {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 20px;
    box-shadow: 0;
    overflow: hidden;
    display: flex;
    align-items: end;
}

.tour-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: .5s;
    z-index: -1;
}

.tour-card:hover .tour-img {
    opacity: 0.8;
    transform: scale(1.01);
}

.tour-name {
    font-weight: 300;
    color:white;
    margin:0;
    padding:0;
}

.tour-action {
    font-size: 14px;
    position: relative;
    color:white;
}

.tour-body {
    width: 100%;
    padding: 10px;
    background: rgba(0, 0, 0, 0.404);
    color: white;
    text-align: left;
}
</style>