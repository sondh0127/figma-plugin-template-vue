var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// node_modules/.pnpm/tsup@5.12.1_typescript@4.6.2/node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/.pnpm/tsup@5.12.1_typescript@4.6.2/node_modules/tsup/assets/cjs_shims.js"() {
  }
});

// src/code.ts
init_cjs_shims();

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.4/node_modules/@create-figma-plugin/utilities/lib/index.js
init_cjs_shims();

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.4/node_modules/@create-figma-plugin/utilities/lib/events.js
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

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.4/node_modules/@create-figma-plugin/utilities/lib/node/get-nodes/get-parent-node.js
init_cjs_shims();
function getParentNode(node) {
  const parentNode = node.parent;
  if (parentNode === null) {
    throw new Error(`\`node.parent\` is \`null\``);
  }
  return parentNode;
}

// node_modules/.pnpm/@create-figma-plugin+utilities@1.8.4/node_modules/@create-figma-plugin/utilities/lib/node/traverse-node-async.js
init_cjs_shims();
async function traverseNodeAsync(node, processNodeAsync, stopTraversalAsync) {
  if (node.removed === true) {
    return;
  }
  if ("children" in node && (typeof stopTraversalAsync !== "function" || await stopTraversalAsync(node) === false)) {
    for (const childNode of node.children) {
      await traverseNodeAsync(childNode, processNodeAsync, stopTraversalAsync);
    }
  }
  await processNodeAsync(node);
}

// src/utils/index.ts
init_cjs_shims();
var SIGMA_PLUGIN_DATA = "SIGMA_PLUGIN_DATA";
var QUX_KEYS = [
  "quxType",
  "quxOnClickCallback",
  "quxOnChangeCallback",
  "quxDataBindingDefault",
  "quxDataValue",
  "quxStyleHoverBackground",
  "quxStyleHoverBorder",
  "quxStyleHoverColor",
  "quxStyleFocusBackground",
  "quxStyleFocusBorder",
  "quxStyleFocusColor",
  "quxStyleCursor",
  "quxStyleDisplay",
  "quxStyleMinWidth",
  "quxStyleMaxWidth",
  "quxWrapContent",
  "quxBreakpointMobile",
  "quxBreakpointTablet",
  "quxBreakpointDesktop",
  "quxStartScreen",
  "quxOverlayScreen",
  "quxHasOverlayBackground",
  "quxOnLoadCallback"
];
function getNodeData(node) {
  const pluginData = node.getPluginData(SIGMA_PLUGIN_DATA);
  if (pluginData === "") {
    return {};
  }
  return JSON.parse(pluginData);
}
function setNodeData(node, nodeData) {
  if (Object.keys(nodeData).length === 0) {
    node.setPluginData(SIGMA_PLUGIN_DATA, "");
    return;
  }
  node.setPluginData(SIGMA_PLUGIN_DATA, JSON.stringify(nodeData));
}

// src/code.ts
var INTERACTIVE_KEY = "INTERACTIVE_KEY";
async function getCharacter(node) {
  if (node.type === "TEXT")
    return node.characters;
  let characters = "";
  if (node) {
  }
  await traverseNodeAsync(node, async (node2) => {
    if (node2.type === "TEXT") {
      characters = node2.characters;
    }
  }, async (node2) => {
    return node2.type === "TEXT";
  });
  return characters;
}
async function syncSingleNodeData() {
  const node = figma.currentPage.selection[0];
  console.log("[LOG] ~ file: code.ts ~ line 29 ~ node", node);
  if (!node) {
    emit("CurrentSelection", void 0);
  } else {
    emit("CurrentSelection", node.id);
    const isTopNode = getParentNode(node).type === "PAGE";
    emit("IsTopNode", isTopNode);
    const quxDataValue = await getCharacter(node);
    const quxReactions = JSON.stringify(node.reactions);
    const nodeData = __spreadProps(__spreadValues({
      quxDataValue
    }, getNodeData(node)), {
      quxReactions
    });
    Object.entries(nodeData).forEach(([key, value]) => {
      emit("SINGLE_NODE_DATA_CHANGE", key, value);
    });
  }
}
async function initData() {
  const data = {
    fileKey: figma.fileKey
  };
  console.log("[LOG] ~ file: code.ts ~ line 17 ~ data", data);
  emit("INIT_DATA", data);
}
async function initStorage() {
  const storage = await figma.clientStorage.getAsync(INTERACTIVE_KEY);
  console.log("[LOG] ~ file: code.ts ~ line 17 ~ storage", storage);
  emit("INIT_STORAGE", storage);
}
on("SINGLE_NODE_DATA_CHANGE", (key, data) => {
  const node = figma.currentPage.selection[0];
  const nodeData = getNodeData(node);
  nodeData[key] = data;
  setNodeData(node, nodeData);
});
on("SYNC_STORAGE", (data) => {
  figma.clientStorage.setAsync(INTERACTIVE_KEY, data);
});
on("SyncCurrentNodeData", async () => {
  await syncSingleNodeData();
});
figma.on("run", async () => {
  initData();
  await syncSingleNodeData();
  await initStorage();
});
figma.on("selectionchange", () => {
  QUX_KEYS.forEach((key) => {
    emit("SINGLE_NODE_DATA_CHANGE", key, "");
  });
  syncSingleNodeData();
});
figma.showUI(__html__, {
  width: 240,
  height: 480
});
