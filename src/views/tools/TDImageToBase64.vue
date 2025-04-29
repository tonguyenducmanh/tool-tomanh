<template>
  <div class="container">
    <h1>💖 Image To base 64 tool!</h1>
    <div ref="drop-zone" class="drop-zone">
      <p>Paste image here (Ctrl+V) or drag & drop</p>
      <div ref="preview"></div>
    </div>
    <div class="result-container">
      <TDTextarea
        ref="base64-output"
        :readOnly="true"
        placeHolder="Base64 output will appear here"
      ></TDTextarea>
      <button ref="copy-btn">Copy Base64</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TDImageToBase64",
  created() {},
  mounted() {},
  methods: {},
  data() {
    return {};
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
