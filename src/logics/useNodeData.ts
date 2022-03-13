import { emit, on } from "@create-figma-plugin/utilities"
import { SingleNodeDataChange } from "../types"

export function useNodeData(dataKey: string) {
  const state = ref('')

  const { pause, resume } = pausableWatch(state, (newValue) => {
    const value = newValue === '' ? undefined : newValue
    emit<SingleNodeDataChange>('SINGLE_NODE_DATA_CHANGE', dataKey, value)
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
