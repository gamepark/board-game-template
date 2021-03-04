import {css, Global} from '@emotion/react'
import MyBoardGame from '@gamepark/board-game-template'
import {createGameStore} from '@gamepark/react-client'
import normalize from 'emotion-normalize'
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

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: 'Oswald', "Roboto Light", serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('board-game-template', MyBoardGame)}>
      <App/>
    </Provider>
    <Global styles={[normalize, style]}/>
  </React.StrictMode>,
  document.getElementById('root')
)
