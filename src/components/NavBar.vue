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
            <router-link to="/profile" class = "profile_view"> <font-awesome-icon icon="user" /> View Profile</router-link>
            <SignOutButton id="signout"/>
        </div>
    </div>
</template>
  
<script>
  import { RouterLink, RouterView } from "vue-router";
  import SignOutButton from "./SignoutButton.vue";  
  import { mapGetters, mapActions} from "vuex";

  export default {
    name: 'NavBar',
    components: {
        SignOutButton
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
    height: 70px;
    border-bottom: 2px solid black;
    background-color: white;
}

#main_logo_rect {
    display: relative;
    width: 80px;
    padding-right: 15px;
    padding-left: 5px;

}

#main_logo_rect img {
    transition: transform 0.3s ease; /* Smooth transition for scaling */

}

#main_logo_rect:hover img {
    transform: scale(1.05); /* Increase the size slightly on hover */
    transform: rotate(15deg);
}

.main_logo {
    cursor: pointer;
    width: 65px;
    height: auto;
    image-rendering: optimizeQuality;
}

.nav_links{
    font-size: 25px;
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
    width: 60px;
    height: 60px;
    margin-left: auto;

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

.profile_view {
    margin-left: 15px;
    background-color: #e0e0e0;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: auto;
    height: fit-content;
    margin-bottom: 5px;
    margin-top: 5px;
    font-size: 13px;
    padding: 3px;
    text-decoration: none;
    text-align: center;
}

#signout {
    border-top: 5px;
}

.dropdown {
    position: absolute;
    top: 72px; /* Should be the same as the height of #profile_rect */
    right: 0;
    z-index: 1000; /* High z-index to ensure it's on top of other content */
    width: 150px; /* Adjust width as needed */

    display: flex;
    flex-direction: column;
    padding: 5px 10px; /* Add some padding inside the dropdown */
    padding-left: 0px;

    background-color: #fff; /* Clean white background */
    border: 1px solid #ccc; /* Subtle border */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for 3D effect */
    border-radius: 4px; /* Rounded corners */
    
    font-family: 'Arial', sans-serif; /* Use a standard font for clarity */
    text-align: left; /* Align text to the left for better readability */
    font-size: 14px; /* Suitable font size for dropdown items */
    color: #333; /* Darker text for better readability */
    line-height: 1.2;
}


.dropdown a:hover, .dropdown div:hover {
    background-color: #17b41c; /* Slightly darker green on hover */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
    color: black;
}


.active {
    font-weight: bold; /* Makes the active tab bold */
    color: #FF5A5F; /* Optional: change color to make it more noticeable */
}



</style>