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

// src/code.ts
once("CREATE_RECTANGLES", (count) => {
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
  figma.closePlugin();
});
once("CLOSE", () => {
  figma.closePlugin();
});
figma.showUI(__html__, {
  width: 240,
  height: 137
});
