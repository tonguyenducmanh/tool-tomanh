<template>
  <div class="td-header">
    <TDInput placeHolder="Tìm kiếm tool" @changeInput="handleSearchTool"></TDInput>
  </div>
</template>

<script>
import TDInput from "@/components/TDInput.vue";

export default {
  name: "TDHeader",
  components: { TDInput },

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
<style lang="scss">
.td-header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
