import { EventHandler } from '@create-figma-plugin/utilities';

export type ElementType = '' | 'TextBox' | 'Vector' | 'Image' | 'Password' | 'TextArea' | 'DropDown' | 'SmartContainer' | 'Link' | 'Custom';

export interface SingleNodeDataChange extends EventHandler {
  name: 'SINGLE_NODE_DATA_CHANGE'
  handler: (key: string, data: string | undefined) => void
}

export interface DefaultData {
  fileKey: string
}

export interface InitData extends EventHandler {
  name: 'INIT_DATA'
  handler: (data: DefaultData) => void
}

export interface DefaultStorage {
  domain: string
}

export interface InitStorage extends EventHandler {
  name: 'INIT_STORAGE'
  handler: (data: string) => void
}


export interface SyncStorage extends EventHandler {
  name: 'SYNC_STORAGE'
  handler: (data: string) => void
}

export interface IsTopNode extends EventHandler {
  name: 'IsTopNode'
  handler: (isTopNode: boolean) => void
}

export interface CurrentSelection extends EventHandler {
  name: 'CurrentSelection'
  handler: (currentSelection?: string) => void
}
