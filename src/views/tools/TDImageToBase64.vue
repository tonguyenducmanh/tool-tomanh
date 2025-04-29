<template>
  <div class="container">
    <h1>💖 Image To base 64 tool!</h1>
    <div ref="drop-zone" class="drop-zone">
      <p>Paste image here (Ctrl+V) or drag & drop</p>
      <img v-if="srcImg" :src="srcImg" ref="preview"></img>
    </div>
    <div class="result-container">
      <TDTextarea
        ref="base64-output"
        placeHolder="Base64 output will appear here"
        v-model="base64Result"
      ></TDTextarea>
      <button ref="copy-btn" @click="haddleCopyEvent">Copy Base64</button>
    </div>
  </div>
</template>

<script>
import _ from "@/common/TDUtility.js";

export default {
  name: "TDImageToBase64",
  created() {
    let me = this;
    document.addEventListener('paste', me.handlePasteEvent);
  },
  beforeUnmount() {
    let me = this;
    document.removeEventListener('paste', me.handlePasteEvent);
  },
  mounted() {},
  methods: {
    haddleCopyEvent() {
      let me = this;
      navigator.clipboard.writeText(me.base64Result);
    },
    handlePasteEvent(e) {
      let me = this;
      e.preventDefault();
      const items = e.clipboardData.items;

      for (let item of items) {
        if (item.type.includes("image")) {
          const blob = item.getAsFile();
          me.handleImageToBase64(blob);
          break;
        }
      }
    },
    handleImageToBase64(blob) {
      let me = this;
      me.srcImg = URL.createObjectURL(blob);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        me.base64Result = reader.result;
      };
      reader.readAsDataURL(blob);
    },
  },
  data() {
    return {
      base64Result: null,
      srcImg:null,
    };
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
