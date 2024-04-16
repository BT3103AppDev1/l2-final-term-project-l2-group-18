<template>
    <div class = "nav_bar_rectangle"> 
        <div id = "main_logo_rect">
        <router-link to = "/home" id= "logo_home_tab">
            <img class = "main_logo" src= "../assets/HTLVlogo.png" alt = "HTLV Logo"> 
        </router-link> 
        </div>
    
        <div class = "nav_links">
            <router-link to = "/home" id= "home_tab" class = "tab">Home</router-link> 
            <router-link to = "/itineraries" id= "itineraries_tab" class = "tab">My Itineraries</router-link> 
            <router-link to = "/community" id= "community_tab" class = "tab">Community</router-link> 
            <router-link to = "/about" id= "about_tab" class = "tab">About</router-link> 
        </div>
        
        <div id = "profile_rect" @mouseleave="hideDropdown">
            <img class = "profile_logo"  :src="userPIC" alt = "Profile Picture" @click="toggleDropdown"> 
            <div v-show = "showDropdown" class = "dropdown">
                <UploadPic @image-uploaded="update_pic($event)" /> 
                <SignOutButton />
            </div>
        </div>
    </div>
</template>
  
<script>
  import { RouterLink, RouterView } from "vue-router";
  import SignOutButton from "./SignoutButton.vue";  
  import UploadPic from "./UploadPic.vue";
  import { mapGetters, mapActions} from "vuex";
import { faL } from "@fortawesome/free-solid-svg-icons";

  export default {
    name: 'NavBar',
    components: {
        SignOutButton,
        UploadPic
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
        toggleDropdown() {
            this.showDropdown = true;
        },
        hideDropdown() {
            this.showDropdown = false;
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
.main_logo {
    cursor: pointer;
    width: 80px;
    height: auto;
}

#main_logo_rect:hover {
    background-color: #FFF35D;
}

.nav_links{
    font-size: 28px;
    font-weight: 500;
    display: flex;
    width: 900px;
    justify-content: space-between;
    cursor: pointer;
}

.tab {
    cursor: pointer;
    text-decoration: none;
    color: #FF5A5F;
    padding: 90px 20px;
    text-align: center;
    width: 25%;
}

.tab:hover {
    background-color: #FFF35D;
    color:#FF2C3B;
}

#profile_rect {
    position: relative;
    width: 80px;
    height: 80px;
    margin-left: auto;
    padding: 2px;
    padding-left: 10px;
    padding-right: 15px;
    cursor: pointer;
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

#itineraries_tab {
    color: #347d36;
}

.dropdown {
    position: absolute;
    top: 92px; /* Should be the same as the height of #profile_rect */
    right: 0;
    background-color: red; /* Ensure it’s a color that stands out */
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1000; /* High z-index to ensure it's on top of other content */
    width: 100px; /* Adjust width as needed */
    display: none; /* Start as hidden */
    flex-direction: column;
    padding: 5px 15px 10px 0px; /* Add some padding inside the dropdown */
    border: 1px solid #ccc; /* Optional: adds a border for better visibility */
}

#profile_rect:hover .dropdown {
    display: flex; /* Show on hover */
}

</style>