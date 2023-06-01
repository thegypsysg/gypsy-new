// store.js
// import { createStore } from "vuex";
import { createStore } from "vuex";

export default createStore({
  state: {
    activeTag: null, // Tag yang aktif
  },
  mutations: {
    setActiveTag(state, tag) {
      state.activeTag = tag; // Memperbarui tag yang aktif
    },
  },
});
