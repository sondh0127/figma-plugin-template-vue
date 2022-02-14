import { emit, on } from "@create-figma-plugin/utilities"
import { DataKeys, SingleNodeDataChange } from "../types"

export function useNodeData(dataKey: DataKeys) {
  const state = ref('')

  const { pause, resume } = pausableWatch(state, (newValue) => {
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', dataKey, newValue)
  })

  on<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', async (key, data) => {
    if (!data) {
      pause()
    }
    if (key === dataKey) {
      state.value = data
    }
    await nextTick()
    resume()
  })

  return state
}
