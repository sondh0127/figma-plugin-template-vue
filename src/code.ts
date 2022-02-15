import { DataKeys, SingleNodeDataChange } from './types'
import { getSelectedNodesOrAllNodes, once, on, emit } from '@create-figma-plugin/utilities';
import { getNodeData, QUX_KEYS, setNodeData } from './utils';

function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0]
  const nodeData = getNodeData(node)
  Object.entries(nodeData).forEach(([key, value]) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key as DataKeys, value)
  })
}

on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', (key, data) => {
  console.log('[LOG] ~ file: code.ts ~ line 57 ~ key, data', key, data)
  const node = getSelectedNodesOrAllNodes()[0]
  const nodeData = getNodeData(node)
  nodeData[key] = data
  setNodeData(node, nodeData)
})

figma.on('run', () => {
  syncSingleNodeData()
})

figma.on('selectionchange', () => {
  const node = getSelectedNodesOrAllNodes()[0]
  QUX_KEYS.forEach((key) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key as DataKeys, '')
  })
  syncSingleNodeData()
})

figma.showUI(__html__, {
  width: 300,
  height: 500
});
