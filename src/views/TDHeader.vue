<template>
  <div class="td-header">
    <div class="td-header-input">
      <TDInput
        placeHolder="Tìm kiếm tool"
        @changeInput="handleSearchTool"
      ></TDInput>
    </div>
  </div>
</template>

<script>
export default {
  name: "TDHeader",

  created() {},
  mounted() {},
  methods: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    handleSearchTool(value) {
      let me = this;
      console.log(value);
    },
  },
};
</script>
<style lang="scss" scoped>
.td-header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--padding);
  padding-bottom: var(--padding);
  .td-header-input {
    display: flex;
    width: 40%;
    height: 100%;
  }
}
</style>
