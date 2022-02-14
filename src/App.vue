<script lang="ts" setup>
import { emit, on } from '@create-figma-plugin/utilities'
import { useNodeData } from './logics';
import { QUX_TYPE, QUX_ON_CLICK_CALLBACK, QUX_ON_CHANGE_CALLBACK, QUX_DATA_BINDING_DEFAULT,
QUX_DATA_VALUE,
QUX_STYLE_HOVER_BORDER,
QUX_STYLE_HOVER_BACKGROUND,
QUX_STYLE_HOVER_COLOR} from './utils';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Ref } from 'vue';
import { ElementType } from './types';

const quxType = useNodeData(QUX_TYPE) as Ref<ElementType>;

const quxOnClickCallback = useNodeData(QUX_ON_CLICK_CALLBACK);
const quxOnChangeCallback = useNodeData(QUX_ON_CHANGE_CALLBACK);
const quxDataBindingDefault = useNodeData(QUX_DATA_BINDING_DEFAULT);
const quxDataValue = useNodeData(QUX_DATA_VALUE);

const quxStyleHoverBackground = useNodeData(QUX_STYLE_HOVER_BACKGROUND);
const quxStyleHoverBorder = useNodeData(QUX_STYLE_HOVER_BORDER);
const quxStyleHoverColor = useNodeData(QUX_STYLE_HOVER_COLOR);

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

const hexColor = ref('')
const opacity = ref('')

function handleHexColorInput(event: Event) {
  const newHexColor = (event.currentTarget as HTMLInputElement).value
  console.log(newHexColor)
  hexColor.value = newHexColor
}

function handleOpacityInput(event: Event) {
  const newOpacity = (event.currentTarget as HTMLInputElement).value
  console.log(newOpacity)
  opacity.value = newOpacity
}
</script>

<template>
    <TabGroup>
      <TabList class="flex py-1 py-2">
        <Tab v-slot="{ selected }" as="template">
          <Title v-if="selected">General</Title>
          <Label v-else>General</Label>
        </Tab>
        <Tab v-slot="{ selected }" as="template">
          <Title v-if="selected">Options</Title>
          <Label v-else>Options</Label>
        </Tab>
        <Tab v-slot="{ selected }" as="template">
          <Title v-if="selected">Styles</Title>
          <Label v-else>Styles</Label>
        </Tab>
      </TabList>
      <TabPanels>
        <Divider></Divider>
        <TabPanel>
          <Title>Element Type</Title>
          <div class="flex pl-2- pr-1">
            <Select class="flex-1" :options="elementTypeOptions" v-model:value="quxType" />
          </div>
        </TabPanel>
        <TabPanel>
          <Title>Method Binding</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxOnClickCallback" />
            <Label>Click</Label>
          </div>
          <div v-if="quxType === 'TextBox'" class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxOnChangeCallback" />
            <Label>Change</Label>
          </div>

          <Divider></Divider>
          <Title>Data Binding</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxDataBindingDefault" />
            <Label>Input/Output</Label>
          </div>

          <Divider></Divider>
          <Title>Data Value</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxDataValue" />
            <Label>Value</Label>
          </div>
        </TabPanel>
        <TabPanel>
          <Title>Hover</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor
              :hex-color="hexColor"
              @hex-color-input="handleHexColorInput"
              v-model:opacity="opacity"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
</template>

<style>
*,
:after,
:before {
  box-sizing: content-box;
}
*,
::focus {
  outline: none;
}
</style>
