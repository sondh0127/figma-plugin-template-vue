<script lang="ts" setup>
import { emit } from '@create-figma-plugin/utilities'
import { CloseHandler, CreateRectanglesHandler } from './types'

const count = ref(5)

const create = () => {
  emit<CreateRectanglesHandler>('CREATE_RECTANGLES', count.value)
}
const cancel = () => {
  emit<CloseHandler>('CLOSE')
}

</script>

<template>
  <h2>Rectangle Creator</h2>
  <p>Count: <input id="count" v-model="count"></p>
  <button id="create" @click="create()">Create</button>
  <button id="cancel" @click="cancel()">Cancel</button>
</template>
