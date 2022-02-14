
<script lang="ts" setup>
import { Ref } from 'vue';

interface Option {
  label: string;
  value: string;
  icon?: string,
  divider?: boolean
}

interface Props {
  options: Option[],
  value: string,
  placeholder: string,
  open: boolean,
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  value: undefined,
  placeholder: undefined,
  open: undefined,
  disabled: false
})

const emit = defineEmits<{
  (event: 'update:value', selection: string): void
  (event: 'update:open', open: boolean): void
}>()

const openState = ref(false);
const selectedKeyState = ref('item-1');

const selectedKey = computed(() => {
  return props.value !== undefined ? props.value : selectedKeyState.value;
})

const isOpen = computed(() => {
  return props.open !== undefined ? props.open : openState.value;
})

const btnLabel = computed(() => {
  if (selectedKey.value || selectedKey.value === '') {
    const item = props.options.find(
      (x) => 'value' in x && x.value === selectedKey.value
    )
    if (item && 'value' in item) return item.label
  }
  return props.placeholder
})

const btnIcon = computed(() => {
  if (selectedKey.value) {
    const item = props.options.find(
      (x) => 'value' in x && x.value === selectedKey.value
    )
    if (item && 'value' in item) return item.icon
  }
  return false
})

function selectItem(e: Event, itemKey: string) {
  e.preventDefault()
  selectedKeyState.value = itemKey
  emit('update:value', itemKey)
  closeSelect()
}

function closeSelect() {
  openState.value = false
  emit('update:open', false)
  document.removeEventListener('click', handleClick)
}

function openSelect() {
  openState.value = true
  emit('update:open', true)
  document.addEventListener('click', handleClick)
}

const rootRef = ref() as Ref<HTMLDivElement>;

function handleClick(e: Event) {
  if (!rootRef.value?.contains(e.target as Node)) {
    closeSelect()
  }
}
</script>

<template>
  <div ref="rootRef" class="fig-select">
    <button class="fig-select__btn" @click="openSelect()" :disabled="disabled">
      <span v-if="btnIcon" class="fig-icon fig-select__icon" :class="`fig-icon--${btnIcon}`" />
      <span
        class="fig-select__btn__label"
        :class="{
          'fig-select__btn__label--placeholder': !selectedKey
        }"
        v-html="btnLabel"
      />
      <span class="fig-select__chevron" />
    </button>
    <ul class="fig-select__input" :class="{ 'fig-select__input--active': isOpen }">
      <template v-for="(item, itemIndex) in options">
        <div v-if="item.divider == true" :key="itemIndex" class="fig-select__input__divider" />
        <li
          v-else
          class="fig-select__input__item"
          :key="item.value"
          :class="{
            'fig-select__input__item--selected':
              item.value === selectedKey
          }"
          @click="selectItem($event, item.value)"
          @keydown.space="selectItem($event, item.value)"
          tabindex="0"
        >
          <span class="fig-select__input__item__icon" />
          <span class="fig-select__input__item__label">
            {{
              item && item.label
            }}
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss">
.fig-select {
  position: relative;

  &__btn {
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    margin: 1px 0 1px 0;
    padding: 0px var(--size-xxsmall) 0px var(--size-xxsmall);
    overflow-y: hidden;
    background-color: var(--white);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);

    & * {
      pointer-events: none;
    }

    &:hover {
      border-color: var(--black1);

      & .select__btn__label--placeholder {
        color: var(--black8);
      }
    }

    &:focus {
      border: 1px solid var(--blue);
      outline: 1px solid var(--blue);
      outline-offset: -2px;

      & .select__btn__label--placeholder {
        color: var(--black8);
      }
    }

    &:disabled {
      &:hover {
        justify-content: flex-start;
        border-color: transparent;

        & .fig-select__chevron {
          margin-left: -12px;
          opacity: 0.3;
        }
      }

      & .fig-select__icon {
        opacity: 0.1;
      }
      & .fig-select__btn__label {
        color: var(--black3);
      }
      &:hover .fig-select__btn__label--placeholder {
        color: var(--black3);
      }
    }

    &:hover .fig-select__chevron,
    &:focus .fig-select__chevron {
      margin-left: auto;
      opacity: 1;
    }

    &__label {
      margin-top: -1px;
      margin-right: 6px;
      overflow-x: hidden;
      color: var(--black8);
      font-weight: var(--font-weight-normal);
      font-size: var(--font-size-xsmall);
      line-height: var(--line-height);
      letter-spacing: var(--font-letter-spacing-neg-xsmall);
      white-space: nowrap;
      text-overflow: ellipsis;

      &--placeholder {
        color: var(--black3);
      }
    }
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: none;
    width: 100%;
    margin: 0;
    padding: var(--size-xxsmall) 0 var(--size-xxsmall) 0;
    overflow-x: overlay;
    overflow-y: auto;
    background-color: var(--bg-hud);
    border-radius: var(--border-radius-small);
    box-shadow: var(--shadow-hud);

    &--active {
      display: block;
    }

    &::-webkit-scrollbar {
      width: 12px;
      background-color: transparent;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
      background-repeat: repeat;
      background-size: 100% auto;
    }
    &::-webkit-scrollbar-track {
      border: solid 3px transparent;
      -webkit-box-shadow: inset 0 0 10px 10px transparent;
      box-shadow: inset 0 0 10px 10px transparent;
    }
    &::-webkit-scrollbar-thumb {
      border: solid 3px transparent;
      border-radius: 6px;
      -webkit-box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
      box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
    }

    &__divider {
      display: block;
      height: 1px;
      margin: 8px 0 7px 0;
      background-color: var(--white2);
    }

    &__item {
      display: flex;
      align-items: center;
      height: var(--size-small);
      padding: 0px var(--size-xsmall) 0px var(--size-xxsmall);
      color: var(--white);
      font-weight: var(--font-weight-normal);
      font-size: var(--font-size-small);
      font-family: var(--font-stack);
      line-height: var(--font-line-height);
      letter-spacing: var(--font-letter-spacing-neg-xsmall);
      outline: none;
      cursor: default;
      user-select: none;

      &--selected {
        & .fig-select__input__item__icon {
          opacity: 1;
        }
      }
      &__label {
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        pointer-events: none;
      }
      &__icon {
        width: var(--size-xsmall);
        height: var(--size-xsmall);
        margin-right: var(--size-xxsmall);
        background-image: url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.2069%205.20724-5.50002%205.49996-.70711.7072-.70711-.7072-3-2.99996%201.41422-1.41421%202.29289%202.29289%204.79293-4.79289z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: center center;
        opacity: 0;
        pointer-events: none;
      }
      &:hover,
      &:focus {
        background-color: var(--blue);
      }
    }
  }

  /*
		Inherits the .icon class styles (_icon.scss)
		but overrides some additional styles
	*/

  &__icon {
    width: var(--size-medium);
    height: var(--size-medium);
    margin-top: -1px;
    margin-right: 2px;
    margin-left: -8px;
    font-size: var(--font-size-xsmall);
    font-family: var(--font-stack);
    cursor: default;
    opacity: 0.3;
    user-select: none;
  }

  &__chevron {
    display: block;
    width: 30px;
    height: 30px;
    margin-top: 0px;
    margin-left: -12px;
    background-image: url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20width%3D%2230%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m15%2016.7071-3-3%20.7071-.7071%202.6465%202.6464%202.6464-2.6464.7071.7071-3%203-.3535.3536z%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0.3;
  }
}
</style>
