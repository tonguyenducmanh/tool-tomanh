import { createRouter, createWebHistory } from "vue-router";
import TDWelcome from "@/views/TDWelcome.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      /**
       * trang chủ
       */
      path: "/",
      name: "home",
      component: TDWelcome,
    },
  ],
});

export default router;
