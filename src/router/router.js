import { createRouter, createWebHistory } from "vue-router";

import { AuthHelper } from "../helpers/AuthHelper";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: (to) => {
        return { path: "/main/photos" };
      },
    },
    {
      path: "/main",
      component: () => import("../views/MainView.vue"),
      props: (route) => ({ category: route.path.split("/")[2] }),
      children: [
        {
          path: "photos",
          name: "main-photos",
          component: () => import("../views/PhotoQueryView.vue"),
        },
        {
          path: "posts",
          name: "main-posts",
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "main-fallback",
          component: () => import("../components/InDevelopment.vue"),
        },
      ],
    },
    {
      path: "/submit",
      children: [
        {
          path: "photo",
          name: "submit-photo",
          component: () => import("../views/PhotoUploadView.vue"),
        },
        {
          path: "post",
          name: "submit-post",
          component: () => import("../views/PostUploadView.vue"),
        },
      ],
    },
    {
      path: "/edit",
      children: [
        {
          path: "photo/:id",
          name: "edit-photo",
          component: () => import("../views/PhotoUploadView.vue"),
        },
        {
          path: "post/:id",
          name: "edit-post",
          props: (route) => ({ mode: "edit", id: route.params.id}),
          component: () => import("../views/PostUploadView.vue"),
        },
      ],
    },
    {
      path: "/posts/:id",
      name: "post-detail",
      component: () => import("../views/PostDetailView.vue"),
    },
    {
      path: "/photos/:id",
      name: "photo-detail",
      component: () => import("../views/PhotoDetailView.vue"),
    },
    {
      path: "/search-photo",
      name: "photo-search",
      component: () => import("../views/PhotoSearchView.vue"),
    },
    {
      path: "/user/:id",
      name: "user-profile",
      redirect: (to) => { return { path: "/user/" + to.params.id + "/photos" } },
      component: () => import("../views/UserProfileView.vue"),
      children: [
        {
          path: "photos",
          name: "user-photos",
          props: (route) => ({ uploaderId: route.params.id }),
          component: () => import("../views/PhotoQueryView.vue"),
        },
        {
          path: "posts",
          name: "user-posts",
          props: (route) => ({ authorId: route.params.id }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "liked-photos",
          name: "user-liked-photos",
          component: () => import("../views/PhotoQueryView.vue"),
        },
        {
          path: "liked-posts",
          name: "user-liked-posts",
          component: () => import("../views/PostQueryView.vue"), 
        },
        {
          path: "comments",
          name: "user-comments",
          component: () => {},
        },
        {
          path: "/:pathMatch(.*)*",
          name: "user-fallback",
          component: () => import("../components/InDevelopment.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/userSettings",
      name: "userSettings",
      component: () => import("../views/UserSettingsView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  if (to.name === "login" || (await AuthHelper.checkIfAuthed())) {
    return true;
  }
  return { name: "login" };
});

export default router;
