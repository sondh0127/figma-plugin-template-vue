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
function once(name, handler) {
  let done = false;
  return on(name, function(...args) {
    if (done === true) {
      return;
    }
    done = true;
    handler(...args);
  });
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
var QUX_TYPE_KEY = "quxType";
function setNodeData(node, nodeData) {
  if (Object.keys(nodeData).length === 0) {
    node.setPluginData(NODE_PLUGIN_DATA_KEY, "");
    return;
  }
  node.setPluginData(NODE_PLUGIN_DATA_KEY, JSON.stringify(nodeData));
}

// src/code.ts
on("CREATE_RECTANGLES", (count) => {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [
      {
        type: "SOLID",
        color: { r: 1, g: 0.5, b: 0 }
      }
    ];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
});
once("CLOSE", () => {
  figma.closePlugin();
});
on("REQUEST_NODE_DATA", () => {
  const data = getSelectedNodesOrAllNodes()[0].getPluginData("quxType");
  emit("GET_NODE_DATA", data);
});
on("SET_NODE_DATA", (data) => {
  console.log("[LOG] ~ file: code.ts ~ line 33 ~ data", data);
  const node = getSelectedNodesOrAllNodes()[0];
  node.setPluginData("quxType", "TextBox2");
});
on("CLEAR_NODE_DATA", () => {
  const node = getSelectedNodesOrAllNodes()[0];
  setNodeData(node, {});
});
function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0];
  const data = node.getPluginData(QUX_TYPE_KEY);
  emit("SINGLE_NODE_DATA_CHANGE", QUX_TYPE_KEY, data);
}
on("SINGLE_NODE_DATA_CHANGE", (key, data) => {
  console.log("[LOG] ~ file: code.ts ~ line 57 ~ key, data", key, data);
  const node = getSelectedNodesOrAllNodes()[0];
  node.setPluginData(key, data);
});
figma.on("run", () => {
  syncSingleNodeData();
});
figma.on("selectionchange", () => {
  emit("SINGLE_NODE_DATA_CHANGE", QUX_TYPE_KEY, "");
  syncSingleNodeData();
});
figma.showUI(__html__, {
  width: 300,
  height: 500
});
