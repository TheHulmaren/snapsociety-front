import { createStore } from "vuex";

export default createStore({
  state: {
    showLoginLoading: false,
  },
  mutations: {
    setLoginLoading(state, payload : boolean) {
      state.showLoginLoading = payload;
    },
  }
});

