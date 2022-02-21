export const SIGMA_PLUGIN_DATA = 'SIGMA_PLUGIN_DATA'
export const QUX_TYPE = 'quxType'
export const QUX_ON_CLICK_CALLBACK = 'quxOnClickCallback'
export const QUX_ON_CHANGE_CALLBACK = 'quxOnChangeCallback'
export const QUX_DATA_BINDING_DEFAULT = 'quxDataBindingDefault'
export const QUX_DATA_VALUE = 'quxDataValue'

export const QUX_STYLE_HOVER_BACKGROUND = 'quxStyleHoverBackground'
export const QUX_STYLE_HOVER_BORDER = 'quxStyleHoverBorder'
export const QUX_STYLE_HOVER_COLOR = 'quxStyleHoverColor'

export const QUX_STYLE_FOCUS_BACKGROUND = 'quxStyleFocusBackground'
export const QUX_STYLE_FOCUS_BORDER = 'quxStyleFocusBorder'
export const QUX_STYLE_FOCUS_COLOR = 'quxStyleFocusColor'

export const QUX_STYLE_CURSOR = 'quxStyleCursor'
export const QUX_STYLE_DISPLAY = 'quxStyleDisplay'

export const QUX_STYLE_MIN_WIDTH = 'quxStyleMinWidth'
export const QUX_STYLE_MAX_WIDTH = 'quxStyleMaxWidth'

export const QUX_WRAP_CONTENT = 'quxWrapContent'

export const QUX_BREAKPOINT_MOBILE = 'quxBreakpointMobile'
export const QUX_BREAKPOINT_TABLET = 'quxBreakpointTablet'
export const QUX_BREAKPOINT_DESKTOP = 'quxBreakpointDesktop'

export const QUX_KEYS = [QUX_TYPE, QUX_ON_CLICK_CALLBACK, QUX_ON_CHANGE_CALLBACK,
  QUX_DATA_BINDING_DEFAULT, QUX_DATA_VALUE, QUX_STYLE_HOVER_BACKGROUND, QUX_STYLE_HOVER_BORDER,
  QUX_STYLE_HOVER_COLOR, QUX_STYLE_FOCUS_BACKGROUND, QUX_STYLE_FOCUS_BORDER, QUX_STYLE_FOCUS_COLOR,
  QUX_STYLE_CURSOR, QUX_STYLE_DISPLAY, QUX_STYLE_MIN_WIDTH, QUX_STYLE_MAX_WIDTH, QUX_WRAP_CONTENT,
  QUX_BREAKPOINT_MOBILE, QUX_BREAKPOINT_TABLET, QUX_BREAKPOINT_DESKTOP
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
