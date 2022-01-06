/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { IAuth } from './state';
import { axios, api } from 'boot/axios';
import jwt_decode from 'jwt-decode';
import { nextTick } from 'vue';
import { LocalStorage } from 'quasar';

export type LoginRequestPayload = {
  username: string;
  password: string;
};

export type LoginResponsePayload = {
  res: {
    jwt: string;
    message: string;
  };
  ok: boolean;
};

const actions: ActionTree<IAuth, StateInterface> = {
  async setAuth({ commit }, payload: string) {
    const jwt = payload;

    commit('setJWT', jwt);
    commit('setJWTPayload', jwt_decode(jwt));
    LocalStorage.set('winsome-jwt', jwt);

    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  },
  async unsetAuth({ commit }) {
    commit('setJWT', '');
    commit('setJWTPayload', null);
    LocalStorage.remove('winsome-jwt');

    api.defaults.headers.common['Authorization'] = null;
  },
  async login({ commit, dispatch }, payload: LoginRequestPayload) {
    commit('setIsLoading', true);
    console.log(api.defaults.baseURL)
    await api.post<LoginResponsePayload>('/login?force=true', payload).then(
      async (response) => {
        const jwt = response.data.res.jwt;
        await dispatch('setAuth', jwt);
      },
      async (error: unknown) => {
        if (axios.isAxiosError(error)) {
          commit('setError', '');
          await nextTick();
          commit('setError', error.response?.data.res ?? '');
        }
        console.error(error);
        await dispatch('unsetAuth');
      }
    );

    commit('setIsLoading', false);
  },
  async logout({ commit, dispatch }) {
    await dispatch('unsetAuth');
  },
};

export default actions;
