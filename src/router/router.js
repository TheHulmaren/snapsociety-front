import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

import store from "../infra/vuex";

import { AuthHelper } from "../helpers/AuthHelper";

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: (to) => {
        let user = AuthHelper.getUser();

        if (!user) {
          return { name: "sign-up" };
        }

        return {
          path: "/main/photos",
          query: { query: "🏆 탑_🕗 지난 일주일" },
        };
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
      name: "sign-up",
      component: () => import("../views/SignUpView.vue"),
    },
    {
      path: "/userSettings",
      name: "user-settings",
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
      name: "manage-bans",
      component: () => import("../views/UserBanView.vue"),
    },
    {
      path: "/banned",
      name: "banned",
      component: () => import("../views/BannedView.vue"),
    },
  ],
});

const userOnlyPages = [
  "user-settings",
  "banned",
  "submit-post",
  "submit-photo",
  "user-profile",
];

router.beforeEach(async (to, from) => {
  // refresh auth token if it's expired
  let expired = AuthHelper.checkIfExpired();

  // if expired, try refresh token
  var authed = true;
  if (expired) {
    store.commit("setLoginLoading", true);
    authed = await AuthHelper.refreshToken();
  }

  // redirect to login page if not authed
  if (!authed && userOnlyPages.includes(to.name)) {
    store.commit("setLoginLoading", false);
    return { name: "login" };
  }

  // redirect to ban page if banned
  if (
    authed &&
    (await AuthHelper.checkIfBanned(AuthHelper.getUser().id)).isBanned
  ) {
    store.commit("setLoginLoading", false);
    return { name: "banned" };
  }

  store.commit("setLoginLoading", false);
  return true;
});

export default router;
