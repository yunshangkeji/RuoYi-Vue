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
    setTimeout(function () {
      commit("END");
    }, 1000)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
