<template>
    <div class = "nav_bar_rectangle"> 
        <div id = "main_logo_rect">
        <router-link to = "/home" id= "logo_home_tab">
            <img class = "main_logo" src= "../assets/HTLVlogo.png" alt = "HTLV Logo"> 
        </router-link> 
        </div>
    
        <div class="nav_links">
            <router-link :to="{ name: 'Home' }" class="tab" :class="{ 'active': $route.name === 'Home' }">Home</router-link>
            <router-link :to="{ name: 'Itineraries' }" class="tab" :class="{ 'active': $route.name === 'Itineraries' }">My Itineraries</router-link>
            <router-link :to="{ name: 'Community' }" class="tab" :class="{ 'active': $route.name === 'Community' }">Community</router-link>
            <router-link :to="{ name: 'About' }" class="tab" :class="{ 'active': $route.name === 'About' }">About</router-link>
        </div>

        <div id = "profile_rect">
            <img class = "profile_logo"  :src="userPIC" alt = "Profile Picture" @click="toggleDropdown"> 
        </div>
        <div v-if= "showDropdown" class = "dropdown">
            <UploadPic @image-uploaded="update_pic($event)" /> 
            <SignOutButton id="signout"/>
        </div>
    </div>
</template>
  
<script>
  import { RouterLink, RouterView } from "vue-router";
  import SignOutButton from "./SignoutButton.vue";  
  import UploadPic from "./UploadPic.vue";
  import { mapGetters, mapActions} from "vuex";

  export default {
    name: 'NavBar',
    components: {
        SignOutButton,
        UploadPic
    },
    mounted() {
        document.addEventListener("click", this.closeDropdown)
    },
    beforeDestroy() {
        document.removeEventListener("click", this.closeDropdown)
    },
    data() {
        return {
            showDropdown: false
        };
    },
    computed: {
        ...mapGetters('user', ['userPIC'])
    },
    methods: {
        ...mapActions('user', ['updatePhoto']),
        async update_pic(url) {
            try {
                await this.updatePhoto(url);
                console.log("NEW URL",this.userPIC)
            } catch (error) {
                console.error("Error updating image:", error);
            }
        },
        toggleDropdown(event) {
            event.stopPropagation(); // Stop click event from propagating
            this.showDropdown = !this.showDropdown;
            console.log("Dropdown status: ", this.showDropdown);
        },
        closeDropdown() {
            if (this.showDropdown){
                this.showDropdown = false;
            }
        }
    }
};
</script>

<style scoped>
.nav_bar_rectangle {
    display: flex;
    justify-content:flex-start; 
    align-items: center;
    width: 100%;
    height: 90px;
    border-bottom: 2px solid black;
    background-color: white;
    overflow: hidden;
}

#main_logo_rect {
    display: relative;
    width: 80px;
    overflow: hidden;
    padding-right: 15px;
    padding-left: 15px;

}

#main_logo_rect img {
    transition: transform 0.3s ease; /* Smooth transition for scaling */

}

#main_logo_rect:hover img {
    transform: scale(1.05); /* Increase the size slightly on hover */
    transform: rotate(20deg);
}

.main_logo {
    cursor: pointer;
    width: 80px;
    height: auto;
    image-rendering: optimizeQuality;
}

.nav_links{
    font-size: 28px;
    font-weight: 500;
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    padding: 20px;
}

.tab {
    cursor: pointer;
    text-decoration: none;
    color: #f4abb0;
    padding: 90px 40px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tab:hover {
    color:#FF2C3B;
    text-decoration: underline;
}

#profile_rect {
    position: relative;
    width: 80px;
    height: 80px;
    margin-left: auto;
    padding: 2px;
    padding-left: 10px;
    padding-right: 25px;
}

.profile_logo {
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #f5bec2;
}

.profile_logo:hover {
    border: 3px solid #FF5A5F; /* Change border color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

.dropdown {
    position: absolute;
    top: 92px; /* Should be the same as the height of #profile_rect */
    right: 0;
    background-color: white; /* Ensure it’s a color that stands out */
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1000; /* High z-index to ensure it's on top of other content */
    width: 100px; /* Adjust width as needed */
    display: flex;
    flex-direction: column;
    padding: 5px 15px 10px 0px; /* Add some padding inside the dropdown */
    border: 1px solid #ccc; /* Optional: adds a border for better visibility */
}

#signout {
    border-top: 5px;
}

.active {
    font-weight: bold; /* Makes the active tab bold */
    color: #FF5A5F; /* Optional: change color to make it more noticeable */
}

</style>