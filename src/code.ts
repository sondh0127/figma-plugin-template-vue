import { ClearNodeData, CloseHandler, CreateRectanglesHandler, GetNodeData, RequestNodeData, SetNodeData, SingleNodeDataChange } from './types'
import { getSelectedNodesOrAllNodes, once, on, emit } from '@create-figma-plugin/utilities';
import { getNodeData, QUX_TYPE_KEY, setNodeData } from './utils';

on<CreateRectanglesHandler>('CREATE_RECTANGLES', (count: number) => {
  const nodes: Array<SceneNode> = []
  for (let i = 0; i < count; i++) {
    const rect = figma.createRectangle()
    rect.x = i * 150
    rect.fills = [
      {
        type: 'SOLID',
        color: { r: 1, g: 0.5, b: 0 }
      }
    ]
    figma.currentPage.appendChild(rect)
    nodes.push(rect)
  }
  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
})

once<CloseHandler>('CLOSE', () => {
  figma.closePlugin()
})

on<RequestNodeData>('REQUEST_NODE_DATA', () => {
  const data = getSelectedNodesOrAllNodes()[0].getPluginData('quxType')
  // const data = getNodeData(getSelectedNodesOrAllNodes()[0])
  emit<GetNodeData>('GET_NODE_DATA', data)
})


on<SetNodeData>('SET_NODE_DATA', (data) => {
  console.log('[LOG] ~ file: code.ts ~ line 33 ~ data', data)
  const node = getSelectedNodesOrAllNodes()[0]
  // setNodeData(node, data)

  node.setPluginData(
    'quxType',
    'TextBox2'
  )
})

on<ClearNodeData>('CLEAR_NODE_DATA', () => {
  const node = getSelectedNodesOrAllNodes()[0]
  setNodeData(node, {})
})

function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0]
  const data = node.getPluginData(QUX_TYPE_KEY)
  emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', QUX_TYPE_KEY, data)
}

on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', (key, data) => {
  console.log('[LOG] ~ file: code.ts ~ line 57 ~ key, data', key, data)
  const node = getSelectedNodesOrAllNodes()[0]
  node.setPluginData(key, data)
})

figma.on('run', () => {
  syncSingleNodeData()
})

figma.on('selectionchange', () => {
  // reset state
  emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', QUX_TYPE_KEY, '')
  syncSingleNodeData()
})



figma.showUI(__html__, {
  width: 300,
  height: 500
});
