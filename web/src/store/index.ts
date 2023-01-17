import { configureStore } from "@reduxjs/toolkit";
import userReduce from "./modules/user/storeUser";
// import themeReduce from "./modules/themes";

// Configuração da store.
const store = configureStore({
  // Redux que faram parte do projeto.
  reducer: {
    // Aqui é colocado todas as Redux do sistema
    userReduce,
    // themeReduce  //(Exemplo)
  },
});

// Tipagem de acesso para os componentes.
export type RootStore = ReturnType<typeof store.getState>;

export default store;

// Prove o acesso ao store pelo APP da aplicação em main.tsx
