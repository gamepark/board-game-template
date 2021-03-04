import MyBoardGame from '@gamepark/board-game-template'
import {createGameStore} from '@gamepark/react-client'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('board-game-template', MyBoardGame)}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)