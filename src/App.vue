<script lang="ts" setup>
import { useNodeData } from "./logics";
import {
  QUX_TYPE,
  QUX_ON_CLICK_CALLBACK,
  QUX_ON_CHANGE_CALLBACK,
  QUX_DATA_BINDING_DEFAULT,
  QUX_DATA_VALUE,
  QUX_STYLE_HOVER_BORDER,
  QUX_STYLE_HOVER_BACKGROUND,
  QUX_STYLE_HOVER_COLOR,
  QUX_STYLE_FOCUS_BACKGROUND,
  QUX_STYLE_FOCUS_BORDER,
  QUX_STYLE_FOCUS_COLOR,
  QUX_STYLE_CURSOR,
  QUX_STYLE_DISPLAY,
  QUX_STYLE_MAX_WIDTH,
  QUX_STYLE_MIN_WIDTH,
  QUX_WRAP_CONTENT,
  QUX_BREAKPOINT_MOBILE,
  QUX_BREAKPOINT_TABLET,
  QUX_BREAKPOINT_DESKTOP,
} from "./utils";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { Ref } from "vue";
import { DefaultData, DefaultStorage, ElementType, InitData, InitStorage, SyncStorage } from "./types";
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

const quxType = useNodeData(QUX_TYPE) as Ref<ElementType>;

const quxOnClickCallback = useNodeData(QUX_ON_CLICK_CALLBACK);
const quxOnChangeCallback = useNodeData(QUX_ON_CHANGE_CALLBACK);
const quxDataBindingDefault = useNodeData(QUX_DATA_BINDING_DEFAULT);
const quxDataValue = useNodeData(QUX_DATA_VALUE);

const quxStyleHoverBackground = useNodeData(QUX_STYLE_HOVER_BACKGROUND);
const quxStyleHoverBorder = useNodeData(QUX_STYLE_HOVER_BORDER);
const quxStyleHoverColor = useNodeData(QUX_STYLE_HOVER_COLOR);

const quxStyleFocusBackground = useNodeData(QUX_STYLE_FOCUS_BACKGROUND);
const quxStyleFocusBorder = useNodeData(QUX_STYLE_FOCUS_BORDER);
const quxStyleFocusColor = useNodeData(QUX_STYLE_FOCUS_COLOR);

const quxStyleCursor = useNodeData(QUX_STYLE_CURSOR);
const quxStyleDisplay = useNodeData(QUX_STYLE_DISPLAY);

const quxStyleMinWidth = useNodeData(QUX_STYLE_MIN_WIDTH);
const quxStyleMaxWidth = useNodeData(QUX_STYLE_MAX_WIDTH);
const quxWrapContent = useNodeData(QUX_WRAP_CONTENT);

const quxBreakpointMobile = useNodeData(QUX_BREAKPOINT_MOBILE);
const quxBreakpointTablet = useNodeData(QUX_BREAKPOINT_TABLET);
const quxBreakpointDesktop = useNodeData(QUX_BREAKPOINT_DESKTOP);

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

</script>

<template>
  <div class="mb-[40px]">
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
          <Title class="!text-yellow-500">Please setup domain to use this plugin</Title>
          <div class="flex space-x-2 pl-2 pr-1">
            <Input class="flex-grow w-full" v-model:value="figmaStorage.domain" />
            <Label>Domain</Label>
          </div>

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
