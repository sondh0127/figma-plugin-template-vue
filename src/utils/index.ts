export const NODE_PLUGIN_DATA_KEY = 'NODE_PLUGIN_DATA_KEY'
export const QUX_TYPE = 'quxType'
export const QUX_ON_CLICK_CALLBACK = 'quxOnClickCallback'
export const QUX_ON_CHANGE_CALLBACK = 'quxOnChangeCallback'
export const QUX_DATA_BINDING_DEFAULT = 'quxDataBindingDefault'
export const QUX_DATA_VALUE = 'quxDataValue'

export const QUX_STYLE_HOVER_BACKGROUND = 'quxStyleHoverBackground'
export const QUX_STYLE_HOVER_BORDER = 'quxStyleHoverBorder'
export const QUX_STYLE_HOVER_COLOR = 'quxStyleHoverColor'

export function randomId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

// export function getNodeData(node: BaseNode): Record<string, string> {
//   const pluginData = node.getPluginData(NODE_PLUGIN_DATA_KEY)
//   if (pluginData === '') {
//     return {}
//   }
//   return JSON.parse(pluginData) as Record<string, string>
// }

// export function setNodeData(
//   node: BaseNode,
//   nodeData: Record<string, string>
// ): void {
//   if (Object.keys(nodeData).length === 0) {
//     node.setPluginData(NODE_PLUGIN_DATA_KEY, '')
//     return
//   }
//   node.setPluginData(
//     NODE_PLUGIN_DATA_KEY,
//     JSON.stringify(nodeData)
//   )
// }
