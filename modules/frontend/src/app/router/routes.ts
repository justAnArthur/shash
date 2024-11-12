import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/app/layouts/(authorized)/index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        components: {
          home: () => import("src/app/pages/(authorized)/index.vue"),
          "chat-side": () => import("src/app/components/chat-list.vue"),
        },
      },
      {
        path: "/chats/:chatId",
        name: "Chat",
        components: {
          home: () => import("src/app/pages/(authorized)/chats/[chatId]/index.vue"),
          "chat-side": () => import("src/app/components/chat-list.vue"),
        },
      },
      {
        path: "/chats",
        name: "Chats",
        components: {
          home: () => import("src/app/pages/(authorized)/chats/index.vue"),
        },
      },
      {
        path: "/settings",
        name: "Settings",
        components: {
          home: () => import("src/app/pages/(authorized)/settings/index.vue"),
        },
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    component: () => import("src/app/layouts/(unauthorized)/index.vue"),
    children: [
      {
        path: "",
        redirect: "/login",
      },
      {
        path: "/register",
        name: "Register",
        component: () => import("src/app/pages/(unauthorized)/register/index.vue"),
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("src/app/pages/(unauthorized)/login/index.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: () => import("src/app/pages/ErrorNotFound.vue"),
  },
];

export default routes;
