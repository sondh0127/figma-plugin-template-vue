export const SIGMA_PLUGIN_DATA = 'SIGMA_PLUGIN_DATA'

// this look bad, we better remove this or model it into separate file then import *
export const QUX_KEYS = ['quxType', 'quxOnClickCallback', 'quxOnChangeCallback',
  'quxDataBindingDefault', 'quxDataValue', 'quxStyleHoverBackground', 'quxStyleHoverBorder',
  'quxStyleHoverColor', 'quxStyleFocusBackground', 'quxStyleFocusBorder', 'quxStyleFocusColor',
  'quxStyleCursor', 'quxStyleDisplay', 'quxStyleMinWidth', 'quxStyleMaxWidth',
  'quxWrapContent', 'quxBreakpointMobile', 'quxBreakpointTablet', 'quxBreakpointDesktop',
  'quxStartScreen', 'quxOverlayScreen', 'quxHasOverlayBackground', 'quxOnLoadCallback'
]

export function randomId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

export function getNodeData(node: BaseNode): Record<string, string> {
  const pluginData = node.getPluginData(SIGMA_PLUGIN_DATA)
  if (pluginData === '') {
    return {}
  }
  return JSON.parse(pluginData) as Record<string, string>
}

export function setNodeData(
  node: BaseNode,
  nodeData: Record<string, string>
): void {
  if (Object.keys(nodeData).length === 0) {
    node.setPluginData(SIGMA_PLUGIN_DATA, '')
    return
  }
  node.setPluginData(
    SIGMA_PLUGIN_DATA,
    JSON.stringify(nodeData)
  )
}
