const state = {
  iLoading: 0
};

const mutations = {
  BEGIN: (state) => {
    state.iLoading++
  },
  END: (state) => {
    state.iLoading--
  }
};

const actions = {
  begin({ commit }) {
    commit("BEGIN");
  },
  end({ commit }) {
    commit("END");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
