<template>
  <div class="td-textarea">
    <textarea
      :placeholder="placeHolder"
      :value="modelValue"
      :disabled="readOnly"
      @input="changeInputValue"
    />
  </div>
</template>

<script>
import _ from "@/common/TDUtility.js";

export default {
  name: "TDTextarea",
  created() {},
  mounted() {},
  methods: {},
  props: {
    placeHolder: {
      type: String,
      default: "Nhập giá trị",
    },
    modelValue: {
      type: String,
      default: null,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: null,
    };
  },
  watch: {
  },
  methods: {
    changeInputValue: _.debounce(function (e) {
      let me = this;
      me.$emit("update:modelValue", e.target.value);
    }, 500),
  },
};
</script>
<style lang="scss" scoped>
.td-textarea {
  display: flex;
  height: 100%;
  width: 100%;

  textarea {
    border: 2px solid var(--border-color);
    width: 100%;
    padding: var(--padding);
    border-radius: var(--border-radius);
  }

  textarea:focus {
    outline: none;
    border: 2px solid var(--focus-color);
  }
}
</style>
