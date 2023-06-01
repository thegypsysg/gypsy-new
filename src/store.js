// store.js
// import { createStore } from "vuex";
import { createStore } from "vuex";

export default createStore({
  state: {
    activeTag: "", // Tag yang aktif
  },
  mutations: {
    setActiveTag(state, tag) {
      state.activeTag = tag; // Memperbarui tag yang aktif
    },
  },
});
