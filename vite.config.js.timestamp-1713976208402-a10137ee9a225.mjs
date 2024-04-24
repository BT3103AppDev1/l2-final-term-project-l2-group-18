// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/andrelim/Desktop/NUS/Academics/23:24%20SEM%202/BT3103%20Application%20Systems%20Development%20for%20Business%20Analytics/Project/l2-final-term-project-l2-group-18/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/andrelim/Desktop/NUS/Academics/23:24%20SEM%202/BT3103%20Application%20Systems%20Development%20for%20Business%20Analytics/Project/l2-final-term-project-l2-group-18/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/andrelim/Desktop/NUS/Academics/23:24%20SEM%202/BT3103%20Application%20Systems%20Development%20for%20Business%20Analytics/Project/l2-final-term-project-l2-group-18/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      // Proxy API requests to Google Maps Directions API
      "/api": {
        target: "https://maps.googleapis.com/maps/api/directions",
        changeOrigin: true,
        // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false
        // Set to true if you're on HTTPS
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5kcmVsaW0vRGVza3RvcC9OVVMvQWNhZGVtaWNzLzIzOjI0IFNFTSAyL0JUMzEwMyBBcHBsaWNhdGlvbiBTeXN0ZW1zIERldmVsb3BtZW50IGZvciBCdXNpbmVzcyBBbmFseXRpY3MvUHJvamVjdC9sMi1maW5hbC10ZXJtLXByb2plY3QtbDItZ3JvdXAtMThcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbmRyZWxpbS9EZXNrdG9wL05VUy9BY2FkZW1pY3MvMjM6MjQgU0VNIDIvQlQzMTAzIEFwcGxpY2F0aW9uIFN5c3RlbXMgRGV2ZWxvcG1lbnQgZm9yIEJ1c2luZXNzIEFuYWx5dGljcy9Qcm9qZWN0L2wyLWZpbmFsLXRlcm0tcHJvamVjdC1sMi1ncm91cC0xOC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYW5kcmVsaW0vRGVza3RvcC9OVVMvQWNhZGVtaWNzLzIzOjI0JTIwU0VNJTIwMi9CVDMxMDMlMjBBcHBsaWNhdGlvbiUyMFN5c3RlbXMlMjBEZXZlbG9wbWVudCUyMGZvciUyMEJ1c2luZXNzJTIwQW5hbHl0aWNzL1Byb2plY3QvbDItZmluYWwtdGVybS1wcm9qZWN0LWwyLWdyb3VwLTE4L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgIC8vIFByb3h5IEFQSSByZXF1ZXN0cyB0byBHb29nbGUgTWFwcyBEaXJlY3Rpb25zIEFQSVxuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9kaXJlY3Rpb25zJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvLyBOZWVkZWQgZm9yIHZpcnR1YWwgaG9zdGVkIHNpdGVzXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgIHNlY3VyZTogZmFsc2UgLy8gU2V0IHRvIHRydWUgaWYgeW91J3JlIG9uIEhUVFBTXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2b0IsU0FBUyxlQUFlLFdBQVc7QUFFaHJCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUgwWSxJQUFNLDJDQUEyQztBQU0zYyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsRUFDTjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsUUFDNUMsUUFBUTtBQUFBO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
