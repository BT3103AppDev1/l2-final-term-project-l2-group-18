<template>
<div>
    <input
    type="file"
    accept="image/*"
    style="display: none"
    ref="photoInput"
    @change="handleFileUpload"
    />
    <button @click="openFilePicker" class="upload-pic-button"> <font-awesome-icon icon="upload" id = "fa_upload_icon"/>  Upload New Profile Picture</button>
</div>
</template>

<script>
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {mapGetters } from "vuex";
    export default {
        computed: {
            ...mapGetters('user', ['userData', 'userUID'])
        },
        emits: ["image-uploaded"],
        methods: {
            openFilePicker() {
                this.$refs.photoInput.click();
            },

            async handleFileUpload(event) {
                const file = event.target.files[0];  // To retrieve the first and only file

                if (file) {
                    const storage = getStorage();
                    const storageRef = ref(storage, 'profile_pics/' + this.userUID + "/" + file.name);

                    try {
                        // Upload the image to Firebase Cloud Storage
                        await uploadBytes(storageRef, file);
                        // Get the download URL of the uploaded image
                        const downloadURL = await getDownloadURL(storageRef);
                        this.$emit("image-uploaded", downloadURL);

                        // Store the download URL in Firestore
                        await updateDoc(doc(getFirestore(), "users", this.userUID), {
                            photoURL: downloadURL
                            });

                        console.log("Image uploaded and URL stored successfully:", downloadURL);
                        
                        } catch (error) {
                            console.error("Error uploading image:", error);
                        }
                    }
                }
            }
        };
</script>

<style scoped>
.upload-pic-button {
  margin-left: 15px;
  padding: 6px 10px;
  background-color: #f5bec2;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: auto;
  height: fit-content;
  margin-bottom: 20px;
  margin-top: 5px;
}

.upload-pic-button:hover {
  background-color: #FF5A5F;
  color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow effect */
}

#fa_upload_icon{
    margin-right: 5px; /* Add some space between the icon and text */
}
</style>
  