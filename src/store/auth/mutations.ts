import { MutationTree } from 'vuex';
import { IAuth } from './state';

const mutation: MutationTree<IAuth> = {
  setJWT(state, jwt: IAuth['jwt']) {
    state.jwt = jwt;
  },
  setJWTPayload(state, jwtPayload: IAuth['jwtPayload']) {
    state.jwtPayload = jwtPayload;
  },
  setError(state, error: IAuth['error']) {
    state.error = error;
  },
  setIsLoading(state, isLoading: IAuth['isLoading']) {
    state.isLoading = isLoading;
  },
};

export default mutation;
