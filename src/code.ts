import { SingleNodeDataChange } from './types'
import { getSelectedNodesOrAllNodes, once, on, emit } from '@create-figma-plugin/utilities';
import { QUX_TYPE } from './utils';

function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0]
  const data = node.getPluginData(QUX_TYPE)
  emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', QUX_TYPE, data)
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
  emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', QUX_TYPE, '')
  syncSingleNodeData()
})

figma.showUI(__html__, {
  width: 300,
  height: 500
});
