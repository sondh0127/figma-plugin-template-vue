import { CloseHandler, CreateRectanglesHandler } from './types'
import { once } from '@create-figma-plugin/utilities';

once<CreateRectanglesHandler>('CREATE_RECTANGLES', (count: number) => {
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
  figma.closePlugin()
})

once<CloseHandler>('CLOSE', () => {
  figma.closePlugin()
})


figma.showUI(__html__, {
  width: 240,
  height: 137
});
