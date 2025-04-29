<template>
  <div class="td-sidebar">
    <template v-for="(item, index) in routerLink">
      <RouterLink class="td-sidebar-item" :id="index" :to="item.path">{{
        item.title
      }}</RouterLink>
    </template>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "TDSidebar",
  components: {},

  created() {},
  mounted() {},
  methods: {},
  props: {},
  data() {
    return {
      routerLink: [
        {
          path: "/",
          title: "Trang chủ",
        },
        {
          path: "/imagetobase64",
          title: "Image to base 64",
        },
        {
          path: "/base64toimage",
          title: "Base 64 to Image",
        },
        {
          path: "/jsontopostgresql",
          title: "Json to postgre sql",
        },
        {
          path: "/textoqrcode",
          title: "Text to QR code",
        },
      ],
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.td-sidebar {
  width: 300px;
  height: 100%;
  background-color: var(--bg-sub-color);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .td-sidebar-item {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    padding: var(--padding);
    padding-left: var(--padding-large);
  }
  .td-sidebar-item:hover {
    background-color: var(--bg-main-color);
  }
}
</style>
