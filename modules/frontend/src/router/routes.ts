import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/(authorized)/index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        components: {
          home: () => import("pages/(authorized)/index.vue"),
          "chat-side": () => import("components/chat-list.vue"),
        },
      },
      {
        path: "/chats",
        name: "Chats",
        components: {
          home: () => import("pages/(authorized)/chats/index.vue"),
        },
      },
      {
        path: "/settings",
        name: "Settings",
        components: {
          home: () => import("pages/(authorized)/settings/index.vue"),
        },
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    component: () => import("layouts/(unauthorized)/index.vue"),
    children: [
      {
        path: "",
        redirect: "/login",
      },
      {
        path: "/register",
        name: "Register",
        component: () => import("pages/(unauthorized)/register/index.vue"),
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("pages/(unauthorized)/login/index.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
