import MyBoardGame from '@gamepark/board-game-template'
import {createGameStore} from '@gamepark/react-client'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import React from 'react'
import ReactDOM from 'react-dom'
import {initReactI18next} from 'react-i18next'
import {Provider} from 'react-redux'
import App from './App'
import translations from './translations.json'

const query = new URLSearchParams(window.location.search)
const locale = query.get('locale') || 'en'
i18next.use(initReactI18next).use(ICU)
i18next.init({
  lng: locale,
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  resources: translations
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('board-game-template', MyBoardGame)}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)