import { EventHandler } from '@create-figma-plugin/utilities';

export type ElementType = '' | 'TextBox' | 'Vector' | 'Image' | 'Password' | 'TextArea' | 'DropDown' | 'SmartContainer' | 'Link' | 'Custom';

export type DataKeys = 'quxType' | 'quxOnClickCallback' | 'quxOnChangeCallback'
  | 'quxDataBindingDefault' | 'quxDataValue' | 'quxStyleHoverBackground'
  | 'quxStyleHoverBorder' | 'quxStyleHoverColor' | 'quxStyleFocusBackground'
  | 'quxStyleFocusBorder' | 'quxStyleFocusColor' | 'quxStyleCursor'
  | 'quxStyleDisplay' | 'quxStyleMinWidth' | 'quxStyleMaxWidth'
  | 'quxWrapContent' | 'quxBreakpointMobile' | 'quxBreakpointTablet' | 'quxBreakpointDesktop';
export interface SingleNodeDataChange extends EventHandler {
  name: 'SINGLE_NODE_DATA_CHANGE'
  handler: (key: DataKeys, data: string) => void
}
