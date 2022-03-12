import { DataKeys, DefaultData, InitData, InitStorage, SingleNodeDataChange, SyncStorage } from './types'
import { getSelectedNodesOrAllNodes, once, on, emit } from '@create-figma-plugin/utilities';
import { getNodeData, QUX_KEYS, setNodeData } from './utils';


const INTERACTIVE_KEY = 'INTERACTIVE_KEY'

function syncSingleNodeData() {
  const node = getSelectedNodesOrAllNodes()[0]
  const nodeData = getNodeData(node)
  Object.entries(nodeData).forEach(([key, value]) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key as DataKeys, value)
  })
}

async function initData() {
  const data: DefaultData = {
    fileKey: figma.fileKey,
  }
  console.log('[LOG] ~ file: code.ts ~ line 17 ~ data', data)
  emit<InitData>('INIT_DATA',data)
}

async function initStorage() {
  const storage = await figma.clientStorage.getAsync(INTERACTIVE_KEY)
  console.log('[LOG] ~ file: code.ts ~ line 17 ~ storage', storage)
  emit<InitStorage>('INIT_STORAGE', storage)
}

on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', (key, data) => {
  console.log('[LOG] ~ file: code.ts ~ line 57 ~ key, data', key, data)
  const node = getSelectedNodesOrAllNodes()[0]
  const nodeData = getNodeData(node)
  nodeData[key] = data
  setNodeData(node, nodeData)
})

on<SyncStorage>('SYNC_STORAGE', (data) => {
  figma.clientStorage.setAsync(INTERACTIVE_KEY, data)
})

figma.on('run', async () => {
  initData()
  syncSingleNodeData()
  await initStorage()
})

figma.on('selectionchange', () => {
  const node = getSelectedNodesOrAllNodes()[0]
  QUX_KEYS.forEach((key) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key as DataKeys, '')
  })
  syncSingleNodeData()
})


figma.showUI(__html__, {
  width: 240,
  height: 480
});
