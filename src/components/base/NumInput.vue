<script lang="ts" setup>
import { Ref } from 'vue';
import { randomId } from '../../utils';
const uniqueId = randomId()

interface Props {
  icon?: string
  iconText: string
  value: number
  disabled: boolean
  border: boolean
  spinning: boolean
  min: number
  max: number
  steps: number
  unit: string
  height: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  iconText: undefined,
  value: 0,
  disabled: false,
  border: false,
  spinning: false,
  min: undefined,
  max: undefined,
  steps: 1,
  unit: undefined,
  height: 28
})

const emit = defineEmits<{
  (event: 'update:value', value: number): void
}>()

const slots = useSlots()
const hasIcon = computed(() => Boolean(slots.icon))
const isAltPressed = ref(false)
const isMouseDown = ref(false)
const mouseDownTarget = ref<string | undefined>(undefined)
const initialMousePos = ref<{x: number, y: number} | undefined>(undefined)
const initialValue = ref<number | undefined>(undefined)
const numInput = ref() as Ref<HTMLInputElement>
// Event handlers
function handleMouseDown(event: MouseEvent, target: string) {
  isMouseDown.value = true
  mouseDownTarget.value = target

  initialMousePos.value = {
    x: event.clientX,
    y: event.clientY
  }

  initialValue.value = props.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  // Prevent select text on alt press
  if (isAltPressed.value) {
    e.preventDefault()
  }
  // Only allow scrubbing when icon clicked or alt key pressed
  if (
    (mouseDownTarget.value === 'input' &&
      isMouseDown.value &&
      isAltPressed.value) ||
    (mouseDownTarget.value === 'icon' && isMouseDown.value)
  ) {
    const newVal =
      initialValue.value! +
      (e.clientX - initialMousePos.value!.x) * props.steps

    emit('update:value', clamp(newVal, props.min, props.max))
  }
}

function handleMouseUp() {
  isMouseDown.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handleKeyAltDown(e: KeyboardEvent) {
  if (e.altKey) {
    isAltPressed.value = true
    e.preventDefault()
  }
}

function handleKeyAltUp() {
  isAltPressed.value = false
}

function handleKeyArrowUp(e: KeyboardEvent) {
  let val = parseFloat((e.target as HTMLInputElement).value) + props.steps
  emit('update:value', clamp(val, props.min, props.max))
  e.preventDefault()
}

function handleKeyArrowDown(e: KeyboardEvent) {
  let val = parseFloat((e.target as HTMLInputElement).value) - props.steps
  emit('update:value', clamp(val, props.min, props.max))
  e.preventDefault()
}
function handleChange(e: Event) {
  let validate = !isNaN(parseFloat((e.target as HTMLInputElement).value))
    ? parseFloat((e.target as HTMLInputElement).value)
    : initialValue.value!

  emit('update:value', clamp(validate, props.min, props.max))
  // Update input element after manual input
  numInput.value.value = props.unit
    ? clamp(validate, props.min, props.max) + props.unit
    : clamp(validate, props.min, props.max) + ''
}

// Helpers
function clamp(value: number, min: number, max: number) {
  if (min != undefined && max != undefined) {
    return round(Math.min(Math.max(value, min), max), 2)
  } else if (min != undefined && max == undefined) {
    return round(Math.max(value, min), 2)
  } else if (min == undefined && max != undefined) {
    return round(Math.min(value, max), 2)
  } else return value
}

function round(value: number, decimals: number) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

onMounted(() => {
  initialValue.value = props.value
  document.addEventListener('keydown', handleKeyAltDown)
  document.addEventListener('keyup', handleKeyAltUp)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyAltDown)
  document.removeEventListener('keyup', handleKeyAltUp)
})

const _height = computed(() => {
  return props.height + 'px'
})

</script>

<template>
  <div class="fig-num-input">
    <div
      v-if="hasIcon"
      class="fig-icon fig-num-input__icon"
      @mousedown="handleMouseDown($event, 'icon')"
    >
      <slot name="icon"></slot>
    </div>
    <div
      v-if="iconText"
      class="fig-num-input__icon--text"
      :class="{ 'fig-icon--spinning': spinning }"
      v-html="iconText"
      @mousedown="handleMouseDown($event, 'icon')"
    />
    <input
      type="input"
      class="fig-num-input__field"
      :class="{
        'fig-num-input--border': border,
        'fig-num-input--indent': hasIcon || iconText,
        'fig-num-input__field--alt-pressed': isAltPressed,
        'fig-num-input__field--is-active': isMouseDown,
        'fig-num-input__field--min-max':
          value == min || value == max
      }"
      :value="`${value}${unit ? unit : ''}`"
      :disabled="disabled"
      :id="uniqueId"
      @change="handleChange"
      @mousedown="handleMouseDown($event, 'input')"
      @keydown.up="handleKeyArrowUp"
      @keydown.down="handleKeyArrowDown"
      ref="numInput"
    />
  </div>
</template>

<style lang="scss">
.fig-num-input {
  position: relative;

  &__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: v-bind(_height);
    margin: 1px 0 1px 0;
    padding: var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxsmall)
      var(--size-xxsmall);
    overflow: visible;
    color: var(--black8);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xsmall);
    line-height: var(--line-height);
    letter-spacing: var(--font-letter-spacing-neg-xsmall);
    background-color: var(--white);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
    outline: none;
    cursor: default;

    &:hover,
    &:placeholder-shown:hover {
      color: var(--black8);
      background-image: none;
      border: 1px solid var(--black1);
    }

    &::selection {
      color: var(--black);
      background-color: var(--blue3);
    }

    &::placeholder {
      color: var(--black3);
      border: 1px solid transparent;
    }

    &:placeholder-shown {
      color: var(--black8);
      background-image: none;
      border: 1px solid var(--black1);
    }
    &:focus:placeholder-shown {
      border: 1px solid var(--blue);
      outline: 1px solid var(--blue);
      outline-offset: -2px;
    }
    &:disabled:hover {
      border: 1px solid transparent;
    }
    &:active,
    &:focus,
    &--is-active {
      color: var(--black);
      border: 1px solid var(--blue);
      outline: 1px solid var(--blue);
      outline-offset: -2px;
    }
    &:disabled {
      position: relative;
      color: var(--black3);
      background-image: none;
    }
    &:disabled:active {
      outline: none;
    }

    &--alt-pressed {
      cursor: ew-resize !important;
    }

    &--min-max:active,
    &--min-max:focus {
      color: var(--blue);
    }
  }

  /*
		Inherits the .icon class styles (_icon.scss)
		but overrides some additional styles
	*/

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0.3;
    pointer-events: all; // Overwrite to enable scrubbing

    &--text {
      position: absolute;
      top: calc(36px / 4);
      left: 12px;
      z-index: 1;
      color: var(--black3);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xsmall);
      opacity: 1;
      user-select: none;
      &:hover {
        cursor: ew-resize !important;
      }
    }

    &:hover {
      cursor: ew-resize !important;
    }
  }

  &--border {
    background-image: none;
    border: 1px solid var(--black1);
    &:disabled {
      background-image: none;
      border: 1px solid transparent;
    }
    &:disabled:placeholder-shown {
      background-image: none;
      border: 1px solid transparent;
    }
    &:disabled:placeholder-shown:active {
      border: 1px solid transparent;
      outline: none;
    }
    &:placeholder-shown {
      background-image: none;
      border: 1px solid var(--black1);
    }
  }

  &--indent {
    padding-left: 32px;
  }
}

// Spinning animation moved to ->  _animations.scss
</style>
