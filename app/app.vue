<script setup lang="ts">
import { provide } from 'vue'
import { useSideStepGame } from '~/composables/useSideStepGame'

const game = useSideStepGame()
provide('game', game)
const { screen } = game
</script>

<template>
  <div id="app">
    <Transition name="fade" mode="out-in">
      <GameStart v-if="screen === 'start'" key="start" />
      <GameCountdown v-else-if="screen === 'countdown'" key="countdown" />
      <GamePlay v-else-if="screen === 'play'" key="play" />
      <GameResult v-else-if="screen === 'result'" key="result" />
    </Transition>
  </div>
</template>
