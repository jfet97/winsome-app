import { JWTPayload } from 'src/domain/JwtPayload';

export interface IAuth {
  jwt: string;
  jwtPayload: JWTPayload | null;
  error: string;
  isLoading: boolean;
}

function state(): IAuth {
  return {
    jwt: '',
    jwtPayload: null,
    error: '',
    isLoading: false,
  };
}

export default state;
