import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { IAuth } from './state';

const getters: GetterTree<IAuth, StateInterface> = {
  isSignedIn(state) {
    return state.jwt != '';
  },
  username(state) {
    return state.jwtPayload?.username ?? '';
  },
};

export default getters;
