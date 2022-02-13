<script lang="ts" setup>
import { emit, on } from '@create-figma-plugin/utilities'
import { ClearNodeData, CloseHandler, CreateRectanglesHandler, GetNodeData, RequestNodeData, SetNodeData, SingleNodeDataChange } from './types'
import { QUX_TYPE_KEY } from './utils';
import Radio from './components/Radio.vue';
import Select from './components/Select.vue';

const count = ref(5)

const create = () => {
  emit<CreateRectanglesHandler>('CREATE_RECTANGLES', count.value)
}

const cancel = () => {
  emit<CloseHandler>('CLOSE')
}

const _data = ref(null)

on<GetNodeData>('GET_NODE_DATA', (data) => {
  console.log('[LOG] ~ file: App.vue ~ line 20 ~ data', data)
  _data.value = data
})

function requestNodeData() {
  emit<RequestNodeData>('REQUEST_NODE_DATA')
}

const hello = ref('')

function setNodeData() {
  emit<SetNodeData>('SET_NODE_DATA', { hello: hello.value })
}

function clearNodeData(){
  emit<ClearNodeData>('CLEAR_NODE_DATA')
}

const quxType = ref('')

const { pause, resume } = pausableWatch(quxType, (newValue, preValue) => {
  console.log('[LOG] ~ file: App.vue ~ line 42 ~ newValue', newValue)
  emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', QUX_TYPE_KEY, newValue)
})

on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', async (key, data) => {
  console.log('[LOG] ~ file: App.vue ~ line 45 ~ key, data', key, data)
  if (!data) {
    pause()
  }
  switch (key) {
    case 'quxType':
      quxType.value = data

      break;

    default:
      break;
  }
  await nextTick()
  resume()
})


const elementTypeOptions = computed(() => {
  return [
    {
      label: 'Default',
      value: '',
    },
    {
      label: 'Input Field',
      value: 'TextBox',
    },
    {
      label: 'Vector Group',
      value: 'Vector',
    },
    {
      label: 'Dynamic Image',
      value: 'Image',
    },
    {
      label: 'Password Field',
      value: 'Password',
    },
    {
      label: 'Text Area',
      value: 'TextArea',
    },
    {
      label: 'DropDown',
      value: 'DropDown',
    },
    {
      label: 'Smart Container',
      value: 'SmartContainer',
      children: {
        key: 'quxSmartContainerType',
        type: 'radio',
        options: [
          {
            label: 'Repeat Children',
            value: 'Repeater',
          },
          {
            label: 'Toggle Children',
            value: 'ChildrenToggle',
          },
        ],
      }
    },
    {
      label: 'Link',
      value: 'Link',
    },
    {
      label: 'Custom',
      value: 'Custom',
      children: {
        key: 'quxTypeCustom',
        type: 'text',
      }
    },
  ]
})

</script>

<template>
  <h2>Rectangle Creator</h2>
  <p>Count: <Input v-model:value="count"/> </p>
  <p>Hello: <Input v-model:value="hello"/> </p>
  <div class="flex space-x-1 flex-wrap">
    <Button @click="create">Create</Button>
    <Button @click="cancel">Cancel</Button>
    <Button @click="setNodeData">Set</Button>
    <Button @click="requestNodeData">Get</Button>
    <Button @click="clearNodeData">Clear</Button>
  </div>
  <div>
    <Input v-model:value="quxType"/>
    <Select :options="elementTypeOptions" v-model:value="quxType">
    </Select>
  </div>
</template>

<style>
*, :after, :before {
  box-sizing: content-box;
}
*, ::focus {
  outline: none;
}
</style>
