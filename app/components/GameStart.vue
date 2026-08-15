<script setup lang="ts">
import { inject } from 'vue'
import type { useSideStepGame } from '~/composables/useSideStepGame'

const game = inject<ReturnType<typeof useSideStepGame>>('game')!
const { startCountdown } = game
</script>

<template>
  <div class="screen">
    <div class="eyebrow">SIDE STEP CHALLENGE</div>
    <h1 class="title">反復横跳び<br>チャレンジ</h1>
    <div class="rule-box">
      <span style="color:#c17a12">●右足</span> は <b>← →</b>、
      <span style="color:#1f7ba3">●左足</span> は <b>A / D</b> で操作。<br>
    </div>
    <button class="btn" @click="startCountdown">ゲーム開始</button>
    <div class="key-hint">
      <span class="key-chip" style="color:var(--amber)">← → 右足</span>
      <span class="key-chip" style="color:#4fb6e8">A D 左足</span>
    </div>
  </div>
</template>
