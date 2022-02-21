<script lang="ts" setup>
import {
  MIXED_STRING,
  convertNamedColorToHexColor,
  isValidHexColor,
  convertHexColorToRgbColor,
  convertRgbColorToHexColor
} from '@create-figma-plugin/utilities';
import { Ref } from 'vue';

const EMPTY_STRING = ''

interface Props {
  disabled?: boolean
  name?: string
  noBorder?: boolean
  propagateEscapeKeyDown?: boolean
  revertOnEscapeKeyDown?: boolean
  hexColor?: string
  hexColorName?: string
  hexColorPlaceholder?: string
  opacity?: number
  opacityName?: string
  opacityPlaceholder?: string
  rgba?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  noBorder: false,
  propagateEscapeKeyDown: true,
  revertOnEscapeKeyDown: false,
  hexColor: '',
  rgba: '',
})
const emit = defineEmits<{
  (name: 'update:rgba', value: RGBA): void
}>()
const vRgba = useVModel(props, 'rgba')

function getOpacityFromRgba(rgba: string): number {
  const [, , , opacity] = rgba.split(',')
  return parseFloat(opacity || '1') * 100
}

function getHexFromRgba(rgba: string): string |null  {
  const [r, g, b] = rgba.replace(/^rgba\(|\s|\)/g, '').split(',')
  const ret = convertRgbColorToHexColor({
    r: parseInt(r) / 255,
    g: parseInt(g) / 255,
    b: parseInt(b) / 255,
  })
  return ret
}



const sourceHexColor = useVModel(props, 'hexColor')
const vHexColor = ref(getHexFromRgba(vRgba.value))
if (sourceHexColor.value)
  syncRef(sourceHexColor, vHexColor)

const sourceOpacity = useVModel(props, 'opacity')
const vOpacity = ref(getOpacityFromRgba(vRgba.value))
if (sourceOpacity.value)
  syncRef(sourceOpacity, vOpacity)


watch(vRgba, (newValue, oldValue) => {
  vHexColor.value = getHexFromRgba(newValue)
  vOpacity.value = getOpacityFromRgba(newValue)
})
const originalHexColor = ref(EMPTY_STRING)
const hexColorInputElementRef = ref() as Ref<HTMLInputElement>
const isRevertOnEscapeKeyDownRef = ref(false)

function normalizeUserInputColor(string: string): null | string {
  const parsedNamedColor = convertNamedColorToHexColor(string)
  if (parsedNamedColor !== null) {
    return parsedNamedColor
  }
  const hexColor = createHexColor(string).toUpperCase()
  if (isValidHexColor(hexColor) === false) {
    return null
  }
  return hexColor
}

function createRgbaColor(
  hexColor: string,
  opacity: string
): string {
  if (
    hexColor === '' ||
    hexColor === MIXED_STRING ||
    opacity === '' ||
    opacity === MIXED_STRING
  ) {
    return ''
  }
  const rgb = convertHexColorToRgbColor(hexColor)
  if (rgb === null) {
    return ''
  }
  const a = parseInt(opacity, 10) / 100
  return `rgba(${rgb.r * 255}, ${rgb.g * 255}, ${rgb.b * 255}, ${a})`
}

function updateHexColor(hexColor: string, delta: number): string {
  const rgbColor = convertHexColorToRgbColor(hexColor)
  if (rgbColor === null) {
    throw new Error('Invalid `hexColor`')
  }
  const { r, g, b } = rgbColor
  const result = convertRgbColorToHexColor({
    b: updateValue(b, delta),
    g: updateValue(g, delta),
    r: updateValue(r, delta)
  })
  if (result === null) {
    throw new Error('Invalid `rgbColor`')
  }
  return result
}

function updateValue(value: number, delta: number): number {
  const newValue = value * 255 + delta
  return Math.min(Math.max(newValue, 0), 255) / 255
}

function createHexColor(string: string): string {
  switch (string.length) {
    case 0: {
      return ''
    }
    case 1: {
      return Array(6).fill(string).join('')
    }
    case 2: {
      return Array(3).fill(string).join('')
    }
    case 3:
    case 4:
    case 5: {
      return `${string[0]}${string[0]}${string[1]}${string[1]}${string[2]}${string[2]}`
    }
    case 6: {
      return string
    }
    default: {
      return string.slice(0, 6)
    }
  }
}

const normalizedHexColor = computed(() => {
  return vHexColor.value === EMPTY_STRING || vHexColor.value === MIXED_STRING
    ? 'FFFFFF'
    : normalizeUserInputColor(vHexColor.value)
})

const renderedHexColor = computed(() => {
  return normalizedHexColor.value === null ? originalHexColor : normalizedHexColor.value
})


const parsedOpacity = computed(() => {
  return vOpacity.value / 100
})

function handleHexColorSelectorFocus(event: Event) {
  const hexColor = (event.currentTarget as HTMLInputElement).value.slice(1).toUpperCase()
  originalHexColor.value = hexColor
}

// WTF
function setHexColorInputElementValue(value: string) {
  const inputElement = hexColorInputElementRef.value
  inputElement.value = value
  const inputEvent = document.createEvent('Event')
  inputEvent.initEvent('input', true, true)
  inputElement.dispatchEvent(inputEvent)
}

function handleHexColorSelectorInput(event: Event) {
  const hexColor = (event.currentTarget as HTMLInputElement).value.slice(1).toUpperCase()
  setHexColorInputElementValue(hexColor)
}

function handleHexColorSelectorKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') {
    return
  }
  if (props.propagateEscapeKeyDown === false) {
    event.stopPropagation()
  }
  if (props.revertOnEscapeKeyDown === true) {
    setHexColorInputElementValue(originalHexColor.value)
    originalHexColor.value = EMPTY_STRING
  }
  (event.currentTarget as HTMLInputElement).blur()
}

function handleHexColorBlur() {
  if (isRevertOnEscapeKeyDownRef.value === true) {
    isRevertOnEscapeKeyDownRef.value = false
    return
  }
  if (vHexColor.value === EMPTY_STRING) {
    if (originalHexColor.value !== EMPTY_STRING) {
      setHexColorInputElementValue(originalHexColor.value)
    }
    originalHexColor.value = EMPTY_STRING
    return
  }
  if (vHexColor.value !== MIXED_STRING) {
    const normalizedHexColor = normalizeUserInputColor(vHexColor.value)
    const newHexColor =
      normalizedHexColor === null ? originalHexColor.value : normalizedHexColor
    if (newHexColor !== vHexColor.value) {
      setHexColorInputElementValue(newHexColor)
    }
  }
  originalHexColor.value = EMPTY_STRING
}

function handleHexColorFocus(event: Event) {
  originalHexColor.value = vHexColor.value;
  (event.currentTarget as HTMLInputElement).select()
}

function handleHexColorInput(event: Event) {
  const newHexColor = (event.currentTarget as HTMLInputElement).value
  vHexColor.value = newHexColor
  if (newHexColor === EMPTY_STRING) {
    vRgba.value = ''
    return
  }
  const normalizedHexColor = normalizeUserInputColor(newHexColor)
  if (normalizedHexColor === null) {
    vRgba.value = ''
    return
  }
  const rgba = createRgbaColor(normalizedHexColor, vOpacity.value + '')
  vRgba.value = rgba
}

function handleHexColorKeyDown(event: KeyboardEvent) {
  const key = event.key
  if (key === 'Escape') {
    if (props.propagateEscapeKeyDown === false) {
      event.stopPropagation()
    }
    if (props.revertOnEscapeKeyDown === true) {
      isRevertOnEscapeKeyDownRef.value = true
      setHexColorInputElementValue(originalHexColor.value)
      originalHexColor.value = EMPTY_STRING
    }
    (event.currentTarget as HTMLInputElement).blur()
    return
  }
  if (key === 'Enter') {
    (event.currentTarget as HTMLInputElement).blur()
    return
  }
  const element = event.currentTarget as HTMLInputElement
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    event.preventDefault()
    const delta = event.shiftKey === true ? 10 : 1
    const startingHexColor =
      vHexColor.value === EMPTY_STRING || vHexColor.value === MIXED_STRING
        ? key === 'ArrowDown'
          ? 'FFFFFF'
          : '000000'
        : vHexColor.value
    const newHexColor = updateHexColor(
      startingHexColor,
      key === 'ArrowDown' ? -1 * delta : delta
    )
    setHexColorInputElementValue(newHexColor)
    element.select()
    return
  }
  if (event.ctrlKey === true || event.metaKey === true) {
    return
  }
}

function handleHexColorMouseUp(event: MouseEvent) {
  if (vHexColor.value !== MIXED_STRING) {
    return
  }
  event.preventDefault()
}

watch(vOpacity, (newOpacity) => {
  const rgba = createRgbaColor(vHexColor.value, newOpacity + '')
  vRgba.value = rgba
})
</script>

<template>
  <div :class="[
    'textboxColor',
    {
      'noBorder': noBorder,
      'disabled': disabled
    }
  ]">
    <div class="color">
      <div
        class="colorFill"
        :style="{ backgroundColor: `#${renderedHexColor}` }"
      ></div>
      <div
        v-if="parsedOpacity !== 1"
        class="colorFill"
        :style="{
          backgroundColor: `#${renderedHexColor}`,
          opacity: parsedOpacity
        }"
      ></div>
      <div class="colorBorder" />
    </div>

    <input
      class="hexColorSelector"
      :disabled="disabled === true"
      @focus="handleHexColorSelectorFocus"
      @input="handleHexColorSelectorInput"
      @keydown="handleHexColorSelectorKeyDown"
      tabindex="-1"
      type="color"
      :value="`#${renderedHexColor}`"
    />
    <input
        v-bind="$attrs"
        ref="hexColorInputElementRef"
        :class="['input', 'hexColorInput']"
        :disabled="disabled"
        :name="hexColorName"
        @blur="handleHexColorBlur"
        @focus="handleHexColorFocus"
        @input="handleHexColorInput"
        @keydown="handleHexColorKeyDown"
        @mousemove="handleHexColorMouseUp"
        :placeholder="hexColorPlaceholder"
        :spellcheck="false"
        :tabindex="disabled === true ? -1 : 0"
        type="text"
        :value="vHexColor === MIXED_STRING ? 'Mixed' : vHexColor"
      />
      <NumInput
        hide-focus
        class="input opacityInput"
        v-model:value="vOpacity"
        icon="horizontal-padding"
        :min="0"
        :max="100"
        :height="28"
        unit="%">
      </NumInput>
    <div class="divider" />
    <div class="border" />
  </div>
</template>

<style lang="scss">
.textboxColor {
  position: relative;
  z-index: 1;
  display: flex;
  width: 144px;
  flex-shrink: 0;
}
.textboxColor:focus-within {
  z-index: 2; /* stack `.textboxColor` over its sibling elements */
}
.disabled {
  opacity: 0.3;
}

.color {
  position: absolute;
  top: 6px;
  left: 8px;
  display: flex;
  overflow: hidden;
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A');
  border-radius: 1px;
}
.colorFill {
  flex-grow: 1;
}
.colorBorder {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  pointer-events: none;
}

.hexColorSelector {
  position: absolute;
  top: -4px;
  left: 0;
  width: 24px;
  height: 36px;
  opacity: 0;
}

.input {
  display: block;
  width: 100%;
  height: 28px;
  background-color: transparent;
  color: var(--black8);
}

.disabled .input,
.disabled .hexColorSelector {
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--black3);
}

.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.hexColorInput {
  flex: 0 0 97px;
  padding-left: 32px;
}

.border {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-width: 1px;
  border-color: var(--bg-silver);
  border-radius: 2;
  pointer-events: none;
}
.textboxColor:not(.disabled) .input:focus ~ .border,
.textboxColor:not(.disabled) .hexColorSelector:focus ~ .border {
  top: -1px;
  bottom: -1px;
  border-width: 2px;
  border-color: var(--blue);
}
.noBorder .border {
  border-color: transparent;
}
.noBorder:not(.disabled):hover .border {
  border-color: var(--bg-silver);
}
.noBorder:not(.disabled) .input:focus ~ .border,
.noBorder:not(.disabled) .hexColorSelector:focus ~ .border {
  border-width: 2px;
  border-color: var(--blue);
}

.divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 96px;
  width: 1px;
  background-color: var(--bg-silver);
  pointer-events: none;
}
.textboxColor:not(.disabled) .input:focus ~ .divider {
  background-color: var(--bg-silver);
}
.noBorder .divider {
  background-color: transparent;
}
.noBorder:not(.disabled):hover .divider {
  background-color: var(--bg-silver);
}
</style>
