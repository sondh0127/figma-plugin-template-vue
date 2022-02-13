import { EventHandler } from '@create-figma-plugin/utilities';

export interface CreateRectanglesHandler extends EventHandler {
  name: 'CREATE_RECTANGLES'
  handler: (count: number) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}

export interface RequestNodeData extends EventHandler {
  name: 'REQUEST_NODE_DATA'
  handler: () => void
}

export interface GetNodeData extends EventHandler {
  name: 'GET_NODE_DATA'
  handler: (data: Record<string, string>) => void
}
export interface SetNodeData extends EventHandler {
  name: 'SET_NODE_DATA'
  handler: (data: Record<string, string>) => void
}

export interface ClearNodeData extends EventHandler {
  name: 'CLEAR_NODE_DATA'
  handler: () => void
}


export type NodeKeys = 'quxType'
export interface SingleNodeDataChange extends EventHandler {
  name: 'SINGLE_NODE_DATA_CHANGE'
  handler: (key: NodeKeys, data: string) => void
}
