interface Card {

    id: number
    src: string
    flip: string
    clickable: boolean
    index: number
}

interface Prepare {
    cards: Card[]
    card1Selected?: Card | undefined
    card2Selected?: Card | undefined
    selectedIndex1?: number | undefined
    selectedIndex2?: number | undefined
    fulltrack: HTMLAudioElement
    flipAudio: HTMLAudioElement
    goodAudio: HTMLAudioElement
    failAudio: HTMLAudioElement
    gameOverAudio: HTMLAudioElement
}

let prepare: Prepare = {
    cards: [],
    fulltrack: new Audio("./assets/audio/fulltrack.mp3"),
    flipAudio: new Audio("./assets/audio/flip.mp3"),
    goodAudio: new Audio("./assets/audio/good.mp3"),
    failAudio: new Audio("./assets/audio/fail.mp3"),
    gameOverAudio: new Audio("./assets/audio/game-over.mp3")

}
prepare.fulltrack.loop = true

let numOfCards = 20
let tempNumbers: string[] = []
let cardsHTMLContent = ''

let getRandomInt = (min: number, max: number) => {
    let result: number = 0
    let exists = true
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1))
        if (!tempNumbers.find(no => no === result.toString())) {
            exists = false

            tempNumbers.push(result.toString())
        }
    }

    return result
}

let toggleFlip = (i: number) => {
    prepare.fulltrack.play()
    let card = prepare.cards[i]
    if (prepare.card1Selected && prepare.card2Selected) return
    if (card && !card.flip && card.clickable) {
        flip(card, i)
        selectedCard(card, i)
    }

}

let flip = (card: Card, i: number) => {
    prepare.flipAudio.play()
    let elem = document.getElementById(`cardFlip-${i}`)
    if (card && elem) {
        card.flip = card.flip === '' ? 'flip' : ''
        elem.classList.toggle('flip')
    }
}

let selectedCard = (card: Card, i: number) => {
    if (prepare.selectedIndex1 === undefined) {
        prepare.card1Selected = card
        prepare.selectedIndex1 = i
    }
    else if (prepare.selectedIndex2 === undefined) {
        prepare.card2Selected = card
        prepare.selectedIndex2 = i
    }

    if (prepare.card1Selected && prepare.card2Selected) {
        if (prepare.card1Selected.src === prepare.card2Selected.src) {
            prepare.card1Selected.clickable = false
            prepare.card2Selected.clickable = false
            prepare.card1Selected = undefined
            prepare.card2Selected = undefined
            prepare.selectedIndex1 = undefined
            prepare.selectedIndex2 = undefined 
            stopAudio(prepare.failAudio)
            stopAudio(prepare.goodAudio)
            prepare.goodAudio.play()
            changeProgress()
            checkFinish()

        }
        else {
            setTimeout(() => {
                stopAudio(prepare.failAudio)
                stopAudio(prepare.goodAudio)
                prepare.failAudio.play()

                let c1s = prepare.card1Selected
                let c2s = prepare.card2Selected
                let sI1 = prepare.selectedIndex1
                let sI2 = prepare.selectedIndex2

                if (c1s && sI1 !== undefined) {
                    flip(c1s, sI1)
                }

                if (c2s && sI2 !== undefined) {
                    flip(c2s, sI2)
                }

                prepare.card1Selected = undefined
                prepare.card2Selected = undefined
                prepare.selectedIndex1 = undefined
                prepare.selectedIndex2 = undefined
            }, 1000)
        }
    }
}

let changeProgress = () => {
    let progress = (prepare.cards.filter(card => !card.clickable).length / numOfCards) *100
    let progressElement = document.getElementById('progressing')
    if (progressElement) {
        progressElement.style.width = `${progress}%`
    }
}

let checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numOfCards) {
        stopAudio(prepare.fulltrack)
        stopAudio(prepare.failAudio)
        stopAudio(prepare.goodAudio)
        prepare.gameOverAudio.play()
    }
}

let stopAudio = (audio: HTMLAudioElement | undefined) => {
    if (audio && audio.played) {
        audio.pause()
        audio.currentTime = 0
    }
}




for (let i = 0; i < numOfCards / 2; i++) {
    prepare.cards.push({
        id: getRandomInt(0, numOfCards),
        src: `./assets/images/${i}.jpg`,
        flip: '',
        clickable: true,
        index: i
    })

    prepare.cards.push({
        id: getRandomInt(0, numOfCards),
        src: `./assets/images/${i}.jpg`,
        flip: '',
        clickable: true,
        index: i
    })
}

prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1)

prepare.cards.forEach((item, i) => {
    cardsHTMLContent += `
    <span class="col-sm-3 col-lg-2">
        <div onclick="toggleFlip(${i})" class="cardFlip">
            <div id="cardFlip-${i}">
                <div class="front">
                    <div class="card">
                        <img src="./assets/back.jpg" alt="" class="cardImage"> 
                        <span class="cardContent">${i + 1}</span>
                    </div>
                </div>
                <div class="back">
                    <div class="card">
                        <img src="./assets/images/${item.index}.jpg" alt="" id="frontCard"> 
                    </div>
                </div>
            </div>
        </div>
    </span>
    `;
})

let elem2 = document.getElementById('memoryCards')
if (elem2) {
    elem2.innerHTML = cardsHTMLContent
}