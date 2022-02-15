var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// node_modules/.pnpm/tsup@5.11.13_typescript@4.5.5/node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/.pnpm/tsup@5.11.13_typescript@4.5.5/node_modules/tsup/assets/cjs_shims.js"() {
  }
});

// src/code.ts
init_cjs_shims();

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.3/node_modules/@create-figma-plugin/utilities/lib/index.js
init_cjs_shims();

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.3/node_modules/@create-figma-plugin/utilities/lib/events.js
init_cjs_shims();
var eventHandlers = {};
var currentId = 0;
function on(name, handler) {
  const id = `${currentId}`;
  currentId += 1;
  eventHandlers[id] = { handler, name };
  return function() {
    delete eventHandlers[id];
  };
}
var emit = typeof window === "undefined" ? function(name, ...args) {
  figma.ui.postMessage([name, ...args]);
} : function(name, ...args) {
  window.parent.postMessage({
    pluginMessage: [name, ...args]
  }, "*");
};
function invokeEventHandler(name, args) {
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args);
    }
  }
}
if (typeof window === "undefined") {
  figma.ui.onmessage = function([name, ...args]) {
    invokeEventHandler(name, args);
  };
} else {
  window.onmessage = function(event) {
    const [name, ...args] = event.data.pluginMessage;
    invokeEventHandler(name, args);
  };
}

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.3/node_modules/@create-figma-plugin/utilities/lib/node/get-nodes/get-selected-nodes-or-all-nodes.js
init_cjs_shims();
function getSelectedNodesOrAllNodes() {
  const selectedNodes = figma.currentPage.selection;
  if (selectedNodes.length > 0) {
    return selectedNodes.slice();
  }
  return figma.currentPage.children.slice();
}

// src/utils/index.ts
init_cjs_shims();
var NODE_PLUGIN_DATA_KEY = "NODE_PLUGIN_DATA_KEY";
var QUX_TYPE = "quxType";
var QUX_ON_CLICK_CALLBACK = "quxOnClickCallback";
var QUX_ON_CHANGE_CALLBACK = "quxOnChangeCallback";
var QUX_DATA_BINDING_DEFAULT = "quxDataBindingDefault";
var QUX_DATA_VALUE = "quxDataValue";
var QUX_STYLE_HOVER_BACKGROUND = "quxStyleHoverBackground";
var QUX_STYLE_HOVER_BORDER = "quxStyleHoverBorder";
var QUX_STYLE_HOVER_COLOR = "quxStyleHoverColor";
var QUX_STYLE_FOCUS_BACKGROUND = "quxStyleFocusBackground";
var QUX_STYLE_FOCUS_BORDER = "quxStyleFocusBorder";
var QUX_STYLE_FOCUS_COLOR = "quxStyleFocusColor";
var QUX_STYLE_CURSOR = "quxStyleCursor";
var QUX_STYLE_DISPLAY = "quxStyleDisplay";
var QUX_STYLE_MIN_WIDTH = "quxStyleMinWidth";
var QUX_STYLE_MAX_WIDTH = "quxStyleMaxWidth";
var QUX_WRAP_CONTENT = "quxWrapContent";
var QUX_BREAKPOINT_MOBILE = "quxBreakpointMobile";
var QUX_BREAKPOINT_TABLET = "quxBreakpointTablet";
var QUX_BREAKPOINT_DESKTOP = "quxBreakpointDesktop";
var QUX_KEYS = [
  QUX_TYPE,
  QUX_ON_CLICK_CALLBACK,
  QUX_ON_CHANGE_CALLBACK,
  QUX_DATA_BINDING_DEFAULT,
  QUX_DATA_VALUE,
  QUX_STYLE_HOVER_BACKGROUND,
  QUX_STYLE_HOVER_BORDER,
  QUX_STYLE_HOVER_COLOR,
  QUX_STYLE_FOCUS_BACKGROUND,
  QUX_STYLE_FOCUS_BORDER,
  QUX_STYLE_FOCUS_COLOR,
  QUX_STYLE_CURSOR,
  QUX_STYLE_DISPLAY,
  QUX_STYLE_MIN_WIDTH,
  QUX_STYLE_MAX_WIDTH,
  QUX_WRAP_CONTENT,
  QUX_BREAKPOINT_MOBILE,
  QUX_BREAKPOINT_TABLET,
  QUX_BREAKPOINT_DESKTOP
];
function getNodeData(node) {
  const pluginData = node.getPluginData(NODE_PLUGIN_DATA_KEY);
  if (pluginData === "") {
    return {};
  }
  return JSON.parse(pluginData);
}
function setNodeData(node, nodeData) {
  if (Object.keys(nodeData).length === 0) {
    node.setPluginData(NODE_PLUGIN_DATA_KEY, "");
    return;
  }
  node.setPluginData(NODE_PLUGIN_DATA_KEY, JSON.stringify(nodeData));
}

// src/code.ts
function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0];
  const nodeData = getNodeData(node);
  Object.entries(nodeData).forEach(([key, value]) => {
    emit("SINGLE_NODE_DATA_CHANGE", key, value);
  });
}
on("SINGLE_NODE_DATA_CHANGE", (key, data) => {
  console.log("[LOG] ~ file: code.ts ~ line 57 ~ key, data", key, data);
  const node = getSelectedNodesOrAllNodes()[0];
  const nodeData = getNodeData(node);
  nodeData[key] = data;
  setNodeData(node, nodeData);
});
figma.on("run", () => {
  syncSingleNodeData();
});
figma.on("selectionchange", () => {
  const node = getSelectedNodesOrAllNodes()[0];
  QUX_KEYS.forEach((key) => {
    emit("SINGLE_NODE_DATA_CHANGE", key, "");
  });
  syncSingleNodeData();
});
figma.showUI(__html__, {
  width: 300,
  height: 500
});
