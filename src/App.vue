<script lang="ts" setup>
import { useNodeData } from "./logics";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { Ref } from "vue";
import { CurrentSelection, DefaultData, DefaultStorage, ElementType, InitData, InitStorage, IsTopNode, SyncCurrentNodeData, SyncStorage } from "./types";
import { on, emit } from "@create-figma-plugin/utilities";
import { ensureSuffix } from '@antfu/utils'

const figmaData = ref<DefaultData>({
  fileKey: ''
})
on<InitData>("INIT_DATA", (data) => {
  figmaData.value = data
})

const figmaStorage = ref<DefaultStorage>({
  domain: ''
})
const { pause, resume } = pausableWatch(figmaStorage, (newValue) => {
  if (newValue) {
    emit<SyncStorage>('SYNC_STORAGE', JSON.stringify(newValue))
  }
}, { deep: true })
on<InitStorage>("INIT_STORAGE", async (storage) => {
  if (!storage) return
  pause()
  figmaStorage.value = JSON.parse(storage)
  await nextTick()
  resume()
})

const isTopNode = ref(false)
on<IsTopNode>('IsTopNode', (value) => {
  isTopNode.value = value
})

const currentSelection = ref<string>()
on<CurrentSelection>('CurrentSelection', (value) => {
  currentSelection.value = value
})


const quxStartScreen = useNodeData('quxStartScreen');
const quxOverlayScreen = useNodeData('quxOverlayScreen');
const quxHasOverlayBackground = useNodeData('quxHasOverlayBackground');
const quxOnLoadCallback = useNodeData('quxOnLoadCallback');

const quxType = useNodeData('quxType') as Ref<ElementType>;

const quxOnClickCallback = useNodeData('quxOnClickCallback');
const quxOnChangeCallback = useNodeData('quxOnChangeCallback');
const quxDataBindingDefault = useNodeData('quxDataBindingDefault');
const quxDataValue = useNodeData('quxDataValue');

const quxStyleHoverBackground = useNodeData('quxStyleHoverBackground');
const quxStyleHoverBorder = useNodeData('quxStyleHoverBorder');
const quxStyleHoverColor = useNodeData('quxStyleHoverColor');

const quxStyleFocusBackground = useNodeData('quxStyleFocusBackground');
const quxStyleFocusBorder = useNodeData('quxStyleFocusBorder');
const quxStyleFocusColor = useNodeData('quxStyleFocusColor');

const quxStyleCursor = useNodeData('quxStyleCursor');
const quxStyleDisplay = useNodeData('quxStyleDisplay');

const quxStyleMinWidth = useNodeData('quxStyleMinWidth');
const quxStyleMaxWidth = useNodeData('quxStyleMaxWidth');
const quxWrapContent = useNodeData('quxWrapContent');

const quxBreakpointMobile = useNodeData('quxBreakpointMobile');
const quxBreakpointTablet = useNodeData('quxBreakpointTablet');
const quxBreakpointDesktop = useNodeData('quxBreakpointDesktop');

const quxReactions = useNodeData('quxReactions');

const elementTypeOptions = computed(() => {
  return [
    {
      label: "Default",
      value: "",
    },
    {
      label: "Input Field",
      value: "TextBox",
    },
    {
      label: "Button",
      value: "Button",
    },
    {
      label: "Vector Group",
      value: "Vector",
    },
    {
      label: "Dynamic Image",
      value: "Image",
    },
    {
      label: "Password Field",
      value: "Password",
    },
    {
      label: "Text Area",
      value: "TextArea",
    },
    {
      label: "DropDown",
      value: "DropDown",
    },
    {
      label: "Smart Container",
      value: "SmartContainer",
      children: {
        key: "quxSmartContainerType",
        type: "radio",
        options: [
          {
            label: "Repeat Children",
            value: "Repeater",
          },
          {
            label: "Toggle Children",
            value: "ChildrenToggle",
          },
        ],
      },
    },
    {
      label: "Link",
      value: "Link",
    },
    {
      label: "Custom",
      value: "Custom",
      children: {
        key: "quxTypeCustom",
        type: "text",
      },
    },
  ];
});

const cursorOptions = computed(() => {
  return [
    {
      label: "Default",
      value: "",
    },
    {
      label: "Pointer",
      value: "pointer",
    },
  ];
});

const displayOptions = computed(() => {
  return [
    {
      label: "Block (Newline)",
      value: "",
    },
    {
      label: "Inline",
      value: "inline",
    },
  ]
})


function syncFile() {
  const domain = ensureSuffix('/', figmaStorage.value?.domain)
  const link = `${domain}#/figma/sync?fileUrl=${figmaData.value.fileKey}`
  window.open(link, '_blank')
}

function syncNodePluginData() {
  emit<SyncCurrentNodeData>('SyncCurrentNodeData')
}

</script>

<template>
  <div class="mb-[40px]">
    <div v-if="!currentSelection">No current selection</div>
    <div v-else-if="isTopNode">
      <Title>Screen</Title>
      <div class="pl-2 pr-1">
        <Checkbox v-model:checked="quxStartScreen">Start Screen</Checkbox>
        <Checkbox v-model:checked="quxOverlayScreen">Overlay</Checkbox>
        <Checkbox
          class="pl-5"
          v-if="quxOverlayScreen"
          v-model:checked="quxHasOverlayBackground"
        >Keep Background</Checkbox>
      </div>
      <Divider></Divider>
      <Title>Method Binding</Title>
      <div class="flex space-x-2 pl-2 pr-1">
        <Input class="flex-grow w-full" v-model:value="quxOnLoadCallback" />
        <Label>On page load</Label>
      </div>
    </div>
    <TabGroup v-else>
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
          <Title
            v-if="!figmaStorage.domain"
            class="!text-yellow-500"
          >Please setup domain to use this plugin</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow w-full" v-model:value="figmaStorage.domain" />
            <Label>Domain</Label>
          </div>

          <Title>Element Type</Title>
          <div class="flex pl-2- pr-1">
            <Select class="flex-1" :options="elementTypeOptions" v-model:value="quxType" />
          </div>
          <Title>Sync Node Data</Title>
          <Button class="mx-[8px]" @click="syncNodePluginData">Sync Data</Button>
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
            <TextBoxColor v-model:rgba="quxStyleHoverBackground" />

            <Label>Fill</Label>
          </div>
          <div class="h-2"></div>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor v-model:rgba="quxStyleHoverBorder" />

            <Label>Stroke</Label>
          </div>
          <div class="h-2"></div>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor v-model:rgba="quxStyleHoverColor" />

            <Label>Text</Label>
          </div>

          <Divider></Divider>

          <Title>Focus</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor v-model:rgba="quxStyleFocusBackground" />

            <Label>Fill</Label>
          </div>
          <div class="h-2"></div>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor v-model:rgba="quxStyleFocusBorder" />
            <Label>Stroke</Label>
          </div>
          <div class="h-2"></div>
          <div class="flex space-x-2 pl-2 pr-1">
            <TextBoxColor v-model:rgba="quxStyleFocusColor" />
            <Label>Text</Label>
          </div>

          <Divider></Divider>
          <Title>Cursor</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Radio class="flex-1" :options="cursorOptions" v-model:value="quxStyleCursor" />
          </div>

          <Divider></Divider>
          <Title>Display</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Radio class="flex-1" :options="displayOptions" v-model:value="quxStyleDisplay" />
          </div>

          <Divider></Divider>
          <Title>Responsive</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxStyleMinWidth" />
            <Label>Min Width</Label>
          </div>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow" v-model:value="quxStyleMaxWidth" />
            <Label>Max Width</Label>
          </div>
          <div>
            <Checkbox v-model:checked="quxWrapContent">Wrap Content</Checkbox>
          </div>

          <Divider></Divider>
          <Title>Breakpoints</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Checkbox v-model:checked="quxBreakpointMobile">Phone</Checkbox>
            <Checkbox v-model:checked="quxBreakpointTablet">Tablet</Checkbox>
            <Checkbox v-model:checked="quxBreakpointDesktop">Desktop</Checkbox>
          </div>

          <Divider></Divider>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
  <div class="absolute bottom-0 left-0 h-[40px] w-full flex items-center justify-end">
    <Button class="mx-[8px]" @click="syncFile">Sync</Button>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
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
