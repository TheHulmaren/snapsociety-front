import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

import { AuthHelper } from "../helpers/AuthHelper";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: (to) => {
        return { path: "/main/photos", query: { query: "🏆 탑_🕗 지난 일주일" } };
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
          props: () => ({ articleType: "photo" }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "all",
          name: "main-all",
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "ask",
          name: "main-ask",
          props: () => ({ articleType: "ask" }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "casual",
          name: "main-casual",
          props: () => ({ articleType: "casual" }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "gear",
          name: "main-gear",
          props: () => ({ articleType: "gear" }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "from-dev",
          name: "main-from-dev",
          props: () => ({ articleType: "from-dev" }),
          component: () => import("../views/PostQueryView.vue"),
        },
        {
          path: "to-dev",
          name: "main-to-dev",
          props: () => ({ articleType: "to-dev" }),
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
          props: (route) => ({ mode: "edit", id: route.params.id }),
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
          props: (route) => ({ userId: route.params.id }),
          component: () => import("../views/UserLikedPhotosView.vue"),
        },
        {
          path: "liked-posts",
          name: "user-liked-posts",
          props: (route) => ({ userId: route.params.id }),
          component: () => import("../views/UserLikedPostsView.vue"),
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
      path: "/signUp",
      name: "signUp",
      component: () => import("../views/SignUpView.vue"),
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
    {
      path: "/manageBans",
      name: "manageBans",
      component: () => import("../views/UserBanView.vue"),
    },
    {
      path: "/banned",
      name: "banned",
      component: () => import("../views/BannedView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  // Redirect to login if not authed
  if (
    !["signUp", "login"].includes(to.name) &&
    !(await AuthHelper.checkIfAuthed())
  ) {
    console.log("not authed");
    return { name: "signUp" };
  }

  // Redirect to ban page if banned
  // but allow logging out and settings
  if (
    !["userSettings", "signUp", "banned", "login"].includes(to.name) &&
    (await AuthHelper.checkIfBanned(AuthHelper.getUser().id)).isBanned
  ) {
    return { name: "banned" };
  }
  return true;
});

export default router;
