<template>
  <div class="td-input">
    <input :placeholder="placeHolder" v-model="value" />
    <slot></slot>
  </div>
</template>

<script>
import _ from "@/common/TDUtility.js";

export default {
  name: "TDInput",
  created() {},
  mounted() {},
  methods: {},
  props: {
    placeHolder: {
      type: String,
      default: "Nhập giá trị",
    },
  },
  data() {
    return {
      value: null,
    };
  },
  watch: {
    value(newVal, oldVal) {
      let me = this;
      me.inputValue(newVal);
    },
  },
  methods: {
    inputValue: _.debounce(function (val) {
      let me = this;
      me.$emit("changeInput", val);
    }, 500),
  },
};
</script>
<style lang="scss" scoped>
.td-input {
  display: flex;
  height: 100%;
  width: 100%;

  input {
    border: 2px solid var(--border-color);
    width: 100%;
    padding: var(--padding);
    border-radius: var(--border-radius);
  }

  input:focus {
    outline: none;
    border: 2px solid var(--focus-color);
  }
}
</style>
