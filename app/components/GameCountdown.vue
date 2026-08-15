<script setup lang="ts">
import { inject } from 'vue'
import type { useSideStepGame } from '~/composables/useSideStepGame'

const game = inject<ReturnType<typeof useSideStepGame>>('game')!
const { countdownLabel, countdownWord } = game
</script>

<template>
  <div class="screen">
    <div class="countdown-num">{{ countdownLabel }}</div>
    <div class="countdown-word">{{ countdownWord }}</div>
  </div>
</template>
