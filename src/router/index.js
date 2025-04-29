import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      /**
       * trang chủ
       */
      path: "/",
      name: "home",
      component: () => import("@/views/TDWelcome.vue"),
    },
    {
      /**
       * chuyển đổi ảnh thành base 64
       */
      path: "/",
      name: "imagetobase64",
      component: () => import("@/views/tools/TDImageToBase64.vue"),
    },
    {
      /**
       * chuyển đổi json thành câu lệnh insert postgresql
       */
      path: "/",
      name: "jsontopostgresql",
      component: () => import("@/views/tools/TDJSONToPostgreSQL.vue"),
    },
    {
      /**
       * chuyển đổi văn bản thành mã QR
       */
      path: "/",
      name: "textoqrcode",
      component: () => import("@/views/tools/TDTextToQRCode.vue"),
    },
  ],
});

export default router;
