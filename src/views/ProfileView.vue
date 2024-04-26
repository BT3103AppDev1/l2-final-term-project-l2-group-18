<template>
<div class="profile-container">
    <div class="header">
        <h1>Your Profile</h1>
        <p class="subtitle">Manage your profile information </p>
    </div>
    <img :src="userPIC" alt="Profile Picture" class="profile-pic"/>
    <UploadPic @image-uploaded="update_pic($event)" />
    
    <p class="username">
        <strong> <font-awesome-icon icon="user-circle" /> Username:
        </strong> {{ Username }}  
        <font-awesome-icon icon="edit" class="edit-icon" @click="toggleEditUsername" />
    </p>

    <div v-if="editUsername">
        <input v-model="newUsername" placeholder="Change username" class="username-input" />
        <button @click="changeUsername" class="username-button">Update Username</button>
    </div>

    <p class="email"><strong><font-awesome-icon icon="envelope" /> Email:</strong> {{ Email }} </p>

    <router-link :to="{ name: 'Home' }" class="home_tab">
        <font-awesome-icon icon="home" id="home_icon_fa"/> Back to Home
    </router-link>
</div>
</template>

<script>
import UploadPic from "../components/UploadPic.vue";
import { mapGetters, mapActions } from 'vuex';
import { RouterLink, RouterView } from "vue-router";

export default {
    data() {
        return {
            newUsername: "", // Holds new username input
            editUsername: false
        };
    },
    mounted() {
        document.body.style.backgroundColor = "#e7dcdc";
    },
    computed: {
        ...mapGetters('user', ['userPIC', 'userData', "userName", "userUID"]),
        Username() {
            return this.userName;
        },
        Email() {
            return this.userData._document.data.value.mapValue.fields.email.stringValue;
        }
    },
    components: {
        UploadPic
    },
    methods: {
        ...mapActions('user', ['updatePhoto', "updateUsername"]),
        toggleEditUsername() {
            this.editUsername = !this.editUsername;  // Toggle the edit state
        },
        async update_pic(url) {
            try {
                await this.updatePhoto(url);
                console.log("NEW URL",this.userPIC)
            } catch (error) {
                console.error("Error updating image:", error);
            }
        },
        changeUsername() {
            if (this.newUsername.trim()) {
                this.updateUsername({userId: this.userUID, username: this.newUsername})
                .then(() => {
                    console.log("Username updated successfully");
                    this.newUsername = "" ; // Clear input after successful update
                    this.editUsername = false; // Hide fields after update
                })
                .catch(error => {
                    console.error("Failed to update username: ", error);
                });
            }
        }
    }
};
</script>

<style scoped>
/* In your CSS */
h1 {
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    font-weight: 510;
    text-align: center;
    text-transform: capitalize;
}


.subtitle {
    color: #666;
    font-size: 1em;
    text-align: center;
    margin-top: -20px; /* Closer to the title */
    margin-bottom: 50px;
    text-transform: capitalize;
}

.profile-container {
    text-align: center;
    margin-top: 20px;
}

.profile-pic {
    width: auto;
    height: 300px;
    border-radius: 50%;
    object-fit: cover; /* Ensures the image covers the area without distortion */
}

.username, .email {
    font-size: 20px; /* Set font size larger */
    color: #021552; /* Optional: change the color if needed */
    margin: 20px 0; /* Adds some vertical spacing */
}

.home_tab {
    display: inline-block;
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    text-decoration: none; /* Removes underline */
    padding: 10px 20px; /* Top and bottom padding 10px, left and right padding 20px */
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.3s, color 0.3s; /* Smooth transition for hover effect */
    margin-top: 15px;
}

.home_tab:hover {
    background-color: #17b41c; /* Slightly darker green on hover */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
    color: black;
}

#home_icon_fa {
  margin-right: 5px; /* Add some space between the icon and text */
  color: white; /* Set the color */
}

.username-input, .username-button {
    display: block; /* Ensure they stack vertically */
    margin-top: 5px;
    padding: 8px;
    width: 15%; /* Adjust width as needed */
    margin-left: auto;
    margin-right: auto;
    border: 0.5px ;
    transition: all 0.5s ease;
}

.username-button {
    background-color: #e17037;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    width: 16%;
}

.username-input:focus, .username-button:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.edit-icon {
    cursor: pointer;
    margin-left: 10px;  
    color: #646464; 
}

.edit-icon:hover {
    color: #0d6efd;  
}

</style>