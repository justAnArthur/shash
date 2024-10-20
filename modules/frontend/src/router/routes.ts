import type { RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/(authorized)/index.vue"),
    children: [
      {
        path: "",
        components: {
          home: () => import("pages/(authorized)/index.vue"),
          "chat-side": () => import("components/chat-list.vue")
        }
      },
      {
        path: "/chats",
        components: {
          home: () => import("pages/(authorized)/chats/index.vue")
        }
      },
      {
        path: "/settings",
        components: {
          home: () => import("pages/(authorized)/settings/index.vue")
        }
      }
    ]
  },
  {
    path: "/auth",
    component: () => import("layouts/(unauthorized)/index.vue"),
    children: [
      {
        path: "register",
        component: () => import("pages/(unauthorized)/register/index.vue")
      },
      {
        path: "login",
        component: () => import("pages/(unauthorized)/login/index.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
]

export default routes
