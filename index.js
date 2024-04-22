// https://deckofcardsapi.com/

const baseUrl = "https://deckofcardsapi.com"
const newDeckButton = document.getElementById("new-deck-button")
const newCardsButton = document.getElementById("new-cards-button")
const cardOne = document.getElementById("card-one")
const cardTwo = document.getElementById("card-two")
const gameResultEl = document.getElementById("game-result")
const deckCountEl = document.getElementById("deck")
const computerScoreEl = document.getElementById("computer-score")
const playerScoreEl = document.getElementById("player-score")
let deckCount
let computerScore
let playerScore
let deckId

const valueArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]

newDeckButton.addEventListener("click", (e) => newDeck(e))
newCardsButton.addEventListener("click", (e) => drawCards(e))

function renderScore() {
  deckCountEl.textContent = deckCount
  computerScoreEl.textContent = computerScore
  playerScoreEl.textContent = playerScore
  if (deckCount == 0) {
    newCardsButton.disabled = true
    if (computerScore > playerScore) {
      gameResultEl.textContent = "Computer win"
    } else if (computerScore < playerScore) {
      gameResultEl.textContent = "Player win"
    } else {
      gameResultEl.textContent = "War"
    }
  } else {
    newCardsButton.disabled = false
  }
}

function calculateScore(cardOne, cardTwo) {
  const cardOneIndex = valueArray.indexOf(cardOne)
  const cardTwoIndex = valueArray.indexOf(cardTwo)
  if (cardOneIndex > cardTwoIndex) {
    computerScore++
  } else if (cardOneIndex < cardTwoIndex) {
    playerScore++
  }
}

function newDeck(e) {
  e.preventDefault()
  gameResultEl.textContent = ""
  fetch(baseUrl + "/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(data => {
      deckId = data.deck_id
      deckCount = data.remaining
      computerScore = 0
      playerScore = 0
      cardOne.src = "#"
      cardOne.alt = ""
      cardTwo.src = "#"
      cardTwo.alt = ""
      newCardsButton.disabled = false
      renderScore()
    })
}

function drawCards(e) {
  e.preventDefault()
  newCardsButton.disabled = true
  fetch(baseUrl + `/api/deck/${deckId}/draw/?count=2`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const cardOneData = data.cards[0]
      const cardTwoData = data.cards[1]
      cardOne.src = cardOneData.image
      cardOne.alt = cardOneData.code
      cardTwo.src = cardTwoData.image
      cardTwo.alt = cardTwoData.alt
      deckCount = data.remaining
      calculateScore(cardOneData.value, cardTwoData.value)
      renderScore()
    })
}