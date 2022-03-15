import { CurrentSelection, DefaultData, InitData, InitStorage, IsTopNode, SingleNodeDataChange, SyncCurrentNodeData, SyncStorage } from './types'
import { on, emit, traverseNodeAsync, getParentNode } from '@create-figma-plugin/utilities';
import { getNodeData, QUX_KEYS, setNodeData } from './utils';


const INTERACTIVE_KEY = 'INTERACTIVE_KEY'

async function getCharacter(node: SceneNode) {

  if (node.type === 'TEXT') return node.characters

  let characters: string = ''
  if (node) {

  }
  await traverseNodeAsync(node, async (node) => {
    if (node.type === 'TEXT') {
      characters = node.characters
    }
  }, async (node) => {
    return node.type === 'TEXT'
  })

  return characters
}

async function syncSingleNodeData() {
  const node = figma.currentPage.selection[0]
  console.log('[LOG] ~ file: code.ts ~ line 29 ~ node', node)
  if (!node) {
    emit<CurrentSelection>('CurrentSelection', undefined)
  } else {
    emit<CurrentSelection>('CurrentSelection', node.id)
    // If node is top-level nodes
    const isTopNode = getParentNode(node).type === 'PAGE'
    emit<IsTopNode>('IsTopNode', isTopNode)
    const quxDataValue = await getCharacter(node)

    const quxReactions = JSON.stringify(node.reactions)

    const nodeData = {
      quxDataValue,
      ...getNodeData(node),
      quxReactions,
    }
    Object.entries(nodeData).forEach(([key, value]) => {
      emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key, value)
    })
  }
}

async function initData() {
  const data: DefaultData = {
    fileKey: figma.fileKey!,
  }
  console.log('[LOG] ~ file: code.ts ~ line 17 ~ data', data)
  emit<InitData>('INIT_DATA', data)
}

async function initStorage() {
  const storage = await figma.clientStorage.getAsync(INTERACTIVE_KEY)
  console.log('[LOG] ~ file: code.ts ~ line 17 ~ storage', storage)
  emit<InitStorage>('INIT_STORAGE', storage)
}

on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', (key, data) => {
  const node = figma.currentPage.selection[0]
  const nodeData = getNodeData(node)
  nodeData[key] = data!
  setNodeData(node, nodeData)
})

on<SyncStorage>('SYNC_STORAGE', (data) => {
  figma.clientStorage.setAsync(INTERACTIVE_KEY, data)
})

on<SyncCurrentNodeData>('SyncCurrentNodeData', async () => {
  await syncSingleNodeData()
})

figma.on('run', async () => {
  initData()
  await syncSingleNodeData()
  await initStorage()
})

figma.on('selectionchange', () => {
  QUX_KEYS.forEach((key) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', key, '')
  })
  syncSingleNodeData()
})


figma.showUI(__html__, {
  width: 240,
  height: 480
});
