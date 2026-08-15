import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export type Screen = 'start' | 'countdown' | 'play' | 'result'
export type FootSide = 'L' | 'R'
export type Direction = 'left' | 'right'

export interface Footprint {
  id: number
  side: FootSide
  pos: number
}

export interface FlashMessage {
  id: number
  text: string
  kind: 'good' | 'bad'
}

// 位置は -1(左ライン) / 0(中央) / 1(右ライン) の符号付き値で管理する
const CENTER_PCT = 50
const STEP_PCT = 30
export const LEFT_IDX = -1
export const CENTER_IDX = 0
export const RIGHT_IDX = 1
const MAX_GAP = 1 // 隣り合うラインまでしか離れられない
const GAME_TIME = 20

export function posToPct(p: number) {
  return CENTER_PCT + p * STEP_PCT
}

export function useSideStepGame() {
  const screen = ref<Screen>('start')

  const score = ref(0)
  const combo = ref(0)
  const bestCombo = ref(0)
  const misses = ref(0)

  const nextDir = ref<Direction>('right')
  const targetIndex = ref<number>(RIGHT_IDX)

  const timeLeft = ref(GAME_TIME)
  const posL = ref(CENTER_IDX)
  const posR = ref(CENTER_IDX)

  const footprints = ref<Footprint[]>([])
  const flashMessage = ref<FlashMessage | null>(null)

  const countdownLabel = ref('3')
  const countdownWord = ref('よーい')

  const scorePop = ref(false)
  const comboPop = ref(false)

  let footprintSeq = 0
  let flashSeq = 0
  let tickTimer: ReturnType<typeof setInterval> | null = null
  let countdownTimer: ReturnType<typeof setInterval> | null = null
  let resultTimer: ReturnType<typeof setTimeout> | null = null
  let gameActive = false

  function resetState() {
    score.value = 0
    combo.value = 0
    bestCombo.value = 0
    misses.value = 0
    nextDir.value = 'right'
    targetIndex.value = RIGHT_IDX
    timeLeft.value = GAME_TIME
    posL.value = CENTER_IDX
    posR.value = CENTER_IDX
    footprints.value = []
    flashMessage.value = null
    gameActive = false
  }

  function flash(text: string, kind: 'good' | 'bad') {
    flashSeq++
    const id = flashSeq
    flashMessage.value = { id, text, kind }
    setTimeout(() => {
      if (flashMessage.value?.id === id) flashMessage.value = null
    }, 600)
  }

  function dropFootprint(pos: number, side: FootSide) {
    footprintSeq++
    const id = footprintSeq
    footprints.value.push({ id, side, pos })
    setTimeout(() => {
      footprints.value = footprints.value.filter(f => f.id !== id)
    }, 950)
  }

  function pop(which: 'score' | 'combo') {
    const target = which === 'score' ? scorePop : comboPop
    target.value = false
    nextTick(() => { target.value = true })
  }

  function illegalMove(reason: string) {
    misses.value++
    combo.value = 0
    flash(reason, 'bad')
  }

  function checkTarget() {
    if (posL.value === posR.value && posL.value === targetIndex.value) {
      combo.value++
      if (combo.value > bestCombo.value) bestCombo.value = combo.value

      let gained = 1
      if (combo.value > 0 && combo.value % 5 === 0) {
        gained += 1
        flash(`COMBO x${combo.value}!`, 'good')
      }
      score.value += gained
      pop('score')
      pop('combo')

      nextDir.value = nextDir.value === 'right' ? 'left' : 'right'
      targetIndex.value = nextDir.value === 'right' ? RIGHT_IDX : LEFT_IDX
    }
  }

  function tryMoveFoot(foot: FootSide, delta: number) {
    if (!gameActive) return
    const curPos = foot === 'R' ? posR.value : posL.value
    const newPos = curPos + delta

    // 盤の端: 物理的な壁なのでミス扱いにはしない
    if (newPos < LEFT_IDX || newPos > RIGHT_IDX) return

    const newPosR = foot === 'R' ? newPos : posR.value
    const newPosL = foot === 'L' ? newPos : posL.value

    if (newPosR < newPosL) { illegalMove('足がクロスしている！'); return }
    if (Math.abs(newPosR - newPosL) > MAX_GAP) { illegalMove('足が広がらない！'); return }

    if (foot === 'R') posR.value = newPos
    else posL.value = newPos

    dropFootprint(newPos, foot)
    checkTarget()
  }

  function startCountdown() {
    resetState()
    screen.value = 'countdown'
    const seq = ['3', '2', '1', 'GO!']
    let i = 0
    countdownLabel.value = seq[0]
    countdownWord.value = 'よーい'

    countdownTimer = setInterval(() => {
      i++
      if (i >= seq.length) {
        if (countdownTimer) clearInterval(countdownTimer)
        beginGame()
        return
      }
      countdownLabel.value = seq[i]
      countdownWord.value = i < 3 ? 'よーい' : 'どん！'
    }, 600)
  }

  function beginGame() {
    screen.value = 'play'
    gameActive = true
    timeLeft.value = GAME_TIME

    let elapsed = 0
    tickTimer = setInterval(() => {
      elapsed += 0.1
      timeLeft.value = Math.max(0, GAME_TIME - elapsed)
      if (timeLeft.value <= 0) endGame()
    }, 100)
  }

  function endGame() {
    if (!gameActive) return
    gameActive = false
    if (tickTimer) clearInterval(tickTimer)
    resultTimer = setTimeout(() => { screen.value = 'result' }, 400)
  }

  function backToStart() {
    resetState()
    screen.value = 'start'
  }

  function handleKey(e: KeyboardEvent) {
    if (!gameActive) return
    if (e.key === 'ArrowRight') { e.preventDefault(); tryMoveFoot('R', 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); tryMoveFoot('R', -1) }
    else if (e.key.toLowerCase() === 'd') { e.preventDefault(); tryMoveFoot('L', 1) }
    else if (e.key.toLowerCase() === 'a') { e.preventDefault(); tryMoveFoot('L', -1) }
  }

  const rank = computed(() => {
    const s = score.value
    if (s >= 44) return { grade: 'S', comment: '' }
    if (s >= 34) return { grade: 'A', comment: '' }
    if (s >= 24) return { grade: 'B', comment: '' }
    if (s >= 14) return { grade: 'C', comment: '' }
    return { grade: 'D', comment: '' }
  })

  const posLPct = computed(() => posToPct(posL.value))
  const posRPct = computed(() => posToPct(posR.value))
  const cueArrow = computed(() => (nextDir.value === 'right' ? '▶' : '◀'))
  const cueText = computed(() => (nextDir.value === 'right' ? '右へ！' : '左へ！'))
  const timeDisplay = computed(() => String(Math.ceil(timeLeft.value)))
  const timePct = computed(() => (timeLeft.value / GAME_TIME) * 100)
  const timeLow = computed(() => timeLeft.value <= 5)

  onMounted(() => window.addEventListener('keydown', handleKey))
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
    if (tickTimer) clearInterval(tickTimer)
    if (countdownTimer) clearInterval(countdownTimer)
    if (resultTimer) clearTimeout(resultTimer)
  })

  return {
    screen,
    score,
    combo,
    bestCombo,
    misses,
    timeDisplay,
    timePct,
    timeLow,
    posLPct,
    posRPct,
    footprints,
    flashMessage,
    cueArrow,
    cueText,
    countdownLabel,
    countdownWord,
    scorePop,
    comboPop,
    rank,
    startCountdown,
    tryMoveFoot,
    backToStart
  }
}
