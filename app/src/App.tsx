import {css} from '@emotion/react'
import {useTranslation} from 'react-i18next'
import './App.css'
import logo from './logo.svg'

export default function App() {
  const {t} = useTranslation()
  return (
    <div className="App" css={css`position: absolute; width: 100%`}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          {t('Game loading…')}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}