import React from 'react'
import ReactDOM from 'react-dom/client'

// Permite que o APP tenha acesso ao store do Redux.
import { Provider } from 'react-redux'
import store from './store'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
