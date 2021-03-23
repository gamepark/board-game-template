import DrawCard from './DrawCard'
import SpendGold from './SpendGold'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = SpendGold | DrawCard // | DoOtherStuff | ChooseCard | MovePawn...

export default Move