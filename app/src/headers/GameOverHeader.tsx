/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const GameOverHeader = () => {
  const { t } = useTranslation()
  return <>{t('game.over')}</>
}
