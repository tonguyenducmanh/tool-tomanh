<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application appp 2.</p>
</template>

<script>
import "@/common/TDPrototype.js";
export default {
  created() {
    let me = this;
    console.log("App is running success: " + new Date());

    document.body.setAttribute("data-theme", "dark");
  },
};
</script>
<style lang="scss">
@import "@/styles/main.scss";
</style>
