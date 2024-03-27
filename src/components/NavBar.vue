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
            <router-link to = "/itineraries" id= "community_tab" class = "tab">Community</router-link> 
            <router-link to = "/itineraries" id= "about_tab" class = "tab">About</router-link> 
        </div>
        <div id = "search_bar_container"> 
            <form id = "search_bar_form">
                <input type="text" id = "search_bar_input" placeholder="Where to next?"> 
                <button type = "submit" id = "submit_button">
                    <img src = "../assets/search_icon.png" alt = "search">
                </button>
            </form>
            
        </div>

        <div id = "profile_rect">
        <router-link to = "/itineraries" id= "profile_logo">
            <img class = "profile_logo"  :src="userPIC" alt = "Profile Picture"> 
        </router-link> 
        </div>
        <UploadPic @image-uploaded="update_pic($event)" /> 
        <SignOutButton />
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
    height: 9vh;
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

#search_bar_container {
    position: relative;
    display: flex;
    flex-grow: 1;
}

#search_bar_form {
    position: relative;
    display: flex;
    flex-grow: 1;
    padding-left: 10px;
}

#search_bar_input {
    flex-grow: 1;
    font-style: italic;
    border: 1px solid;
    border-radius: 25px;
    padding: 10px 40px 5px 15px;
    background-color: rgb(232, 225, 225);
    color: #7f7272;
    font-size: large;
    width:auto;
}

#search_bar_input:hover {
    border: 2px solid #FF5A5F; /* Change border color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

#submit_button {
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
}

#submit_button img {
    width: 20px;
    height: 20px;
}

#profile_rect {
    width: 80px;
    height: 80px;
    overflow: hidden;
    margin-left: auto;
    padding: 2px;
    padding-left: 4px;
}

.profile_logo {
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.profile_logo:hover {
    border: 2px solid #FF5A5F; /* Change border color */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

#itineraries_tab {
    color: #347d36;
}
</style>