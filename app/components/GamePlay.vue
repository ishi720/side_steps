<script setup lang="ts">
import { inject } from 'vue'
import { posToPct } from '~/composables/useSideStepGame'
import type { useSideStepGame } from '~/composables/useSideStepGame'

const game = inject<ReturnType<typeof useSideStepGame>>('game')!
const {
  score, combo, misses, timeDisplay, timePct, timeLow,
  scorePop, comboPop, cueArrow, cueText,
  posLPct, posRPct, footprints, flashMessage,
  tryMoveFoot
} = game
</script>

<template>
  <div class="screen">
    <div class="scoreboard">
      <div class="sb-item">
        <div class="sb-label">SCORE</div>
        <div class="sb-value digits" :class="{ pop: scorePop }">{{ score }}</div>
      </div>
      <div class="sb-div"></div>
      <div class="sb-item">
        <div class="sb-label">COMBO</div>
        <div class="sb-value digits combo" :class="{ pop: comboPop }">{{ combo }}</div>
      </div>
      <div class="sb-div"></div>
      <div class="sb-item">
        <div class="sb-label">MISS</div>
        <div class="sb-value digits miss">{{ misses }}</div>
      </div>
    </div>

    <div class="timebar-wrap">
      <div class="timebar-meta">
        <div class="timebar-label">TIME</div>
        <div class="timebar-value digits" :class="{ low: timeLow }">{{ timeDisplay }}</div>
      </div>
      <div class="timebar-track">
        <div
          class="timebar"
          :style="{
            width: timePct + '%',
            background: timePct <= 25
              ? 'linear-gradient(90deg,var(--red),var(--amber))'
              : 'linear-gradient(90deg,var(--lime),var(--amber))'
          }"
        ></div>
      </div>
    </div>

    <div class="cue-zone">
      <div class="cue-arrow">{{ cueArrow }}</div>
      <div class="cue-text">{{ cueText }}</div>
    </div>

    <div class="court-outer">
      <div class="court"></div>
      <div class="lane-line" style="left:20%"></div>
      <div class="lane-line" style="left:50%"></div>
      <div class="lane-line" style="left:80%"></div>
      <div class="lane-label" style="left:20%">左</div>
      <div class="lane-label" style="left:50%">中央</div>
      <div class="lane-label" style="left:80%">右</div>

      <div id="footL" class="foot" :style="{ left: posLPct + '%' }">
        <span class="foot-tag">L</span>
      </div>
      <div id="footR" class="foot" :style="{ left: posRPct + '%' }">
        <span class="foot-tag">R</span>
      </div>

      <div
        v-for="fp in footprints"
        :key="fp.id"
        class="footprint"
        :class="fp.side === 'R' ? 'fp-r' : 'fp-l'"
        :style="{ left: `calc(${posToPct(fp.pos)}% + ${fp.side === 'R' ? 13 : -13}px)` }"
      ></div>

      <div
        v-if="flashMessage"
        :key="flashMessage.id"
        class="flash-msg"
        :class="flashMessage.kind"
      >
        {{ flashMessage.text }}
      </div>
    </div>

    <div class="touch-controls">
      <div class="tgroup">
        <div class="tgroup-label" style="color:#4fb6e8">左足 A/D</div>
        <div class="tgroup-btns">
          <button class="tbtn tbtn-l" @click="tryMoveFoot('L', -1)">◀</button>
          <button class="tbtn tbtn-l" @click="tryMoveFoot('L', 1)">▶</button>
        </div>
      </div>
      <div class="tgroup">
        <div class="tgroup-label" style="color:var(--amber)">右足 ←/→</div>
        <div class="tgroup-btns">
          <button class="tbtn tbtn-r" @click="tryMoveFoot('R', -1)">◀</button>
          <button class="tbtn tbtn-r" @click="tryMoveFoot('R', 1)">▶</button>
        </div>
      </div>
    </div>
    <div class="kbd-hint">←→ 右足　/　A・D 左足</div>
  </div>
</template>
