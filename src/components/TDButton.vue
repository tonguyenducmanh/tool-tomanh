<template>
  <div class="td-button">
    <button :disabled="readOnly" />
  </div>
</template>

<script>
export default {
  name: "TDButton",
  created() {},
  mounted() {},
  methods: {},
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.td-button {
}
</style>
