<template>
    <div class="back-to-home">
        <a href="/"> 
            <span class="back-arrow">&#8592;</span>
            <div id="homepage_text">Back To Homepage</div>
        </a>
    </div>
</template>
  
  <script>
  export default {
    name: 'BackToHome',
  };
  </script>
  
<style scoped>
    .back-to-home {
        text-align: left;
    }

    .back-to-home a {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: #333;
        padding: 6px;
    }   

    #homepage_text:hover{
        text-decoration: underline;
    }   
    
    .back-arrow {
        font-size: 1.2rem;
        margin-right: 0.5rem;
    }

    .back-arrow:hover {
        text-decoration: none;
    }
</style>