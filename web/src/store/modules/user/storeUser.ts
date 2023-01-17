// Permite criar o objeto e as reduxes.
import { createSlice,  } from "@reduxjs/toolkit";

interface UserState {
  token?: string,
  email?: string,
  isLogged: boolean
}

const userReduce = createSlice({
  name: "user",

  // Estado inicial da aplicação.
  initialState: {
    // Quando ainda nao ter o token de autenticação.
    isLogged: false,
  } as UserState,

  // Actions - Funções do Redux.
  reducers: {
    // Recebe um estado e uma ação.
    // Pega o estado antigo e substitui pelo novo.
    addUser(state, action) {
      // Object.assign - Método que faz a substituição
      Object.assign(state, {
        // Por padrão o action recebe o payload
        token: action.payload.token,
        email: action.payload.email,

        // Com o token e o email altera o isLogged para true.
        isLogged: true,
      });
    },

    // Desconecta o usuário
    removeUser(state, action) {
      Object.assign(state, {
        token: undefined,
        email: undefined,
        isLogged: false,
      });
    },
  },
});

export const { addUser, removeUser } = userReduce.actions;

export default userReduce.reducer;