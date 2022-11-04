/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {Letterbox, Picture} from '@gamepark/react-components'
import Images from './images/Images'
import Game from '@gamepark/board-game-template/Game'

type Props = {
  game: Game
}

export default function GameDisplay({game}: Props) {
  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={sampleCss}>
        {JSON.stringify(game)}
      </div>
      <Picture src={Images.sampleImage} css={sampleImageCss}/>
    </Letterbox>
  )
}

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

const sampleCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  background-color: black;
  padding: 0.5em;
  border-radius: 1em;
`

const sampleImageCss = css`
  position: absolute;
  bottom: 5%;
  left: calc(50% - 6.5em);
  width: 13em;
  height: 20em;
`