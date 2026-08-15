<script setup lang="ts">
import { inject } from 'vue'
import type { useSideStepGame } from '~/composables/useSideStepGame'

const game = inject<ReturnType<typeof useSideStepGame>>('game')!
const { score, bestCombo, misses, rank, startCountdown, backToStart } = game
</script>

<template>
  <div class="screen">
    <div class="rank-badge">{{ rank.grade }}</div>
    <div class="result-score-label">FINAL SCORE</div>
    <div class="result-score digits">{{ score }}</div>
    <div class="result-sub">
      <div>
        <div class="v">{{ bestCombo }}</div>
        <div class="l">BEST COMBO</div>
      </div>
      <div>
        <div class="v">{{ misses }}</div>
        <div class="l">MISS</div>
      </div>
    </div>
    <div class="result-comment">{{ rank.comment }}</div>
    <button class="btn" @click="startCountdown">もう一度挑戦</button>
    <button class="btn ghost" @click="backToStart">タイトルへ戻る</button>
  </div>
</template>
