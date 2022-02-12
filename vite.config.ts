import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import { IndexHtmlTransformResult, IndexHtmlTransformContext } from "vite"
import { Plugin } from "vite"
import { OutputChunk, OutputAsset } from "rollup"

export function viteSingleFile(): Plugin {
	return {
		name: "vite:singlefile",
		transformIndexHtml: {
			enforce: "post",
			transform(html: string, ctx?: IndexHtmlTransformContext): IndexHtmlTransformResult {
				// Only use this plugin during build
				if (!ctx || !ctx.bundle) return html
				// Get the bundle
				let extraCode = ""
				for (const [, value] of Object.entries(ctx.bundle)) {
					const o = value as OutputChunk
					const a = value as OutputAsset
					if (o.code) {
						const reScript = new RegExp(`<script type="module"[^>]*?src="/${value.fileName}"[^>]*?></script>`)
						const reImport = new RegExp(/import".*?js";/)
						const reAssetsLoader = new RegExp(/!function.*\("\/assets\/"\);/)
						const code = `<script type="module">\n//${o.fileName}\n${o.code.replace(reAssetsLoader, '').replace(reImport, '')}\n</script>`
						html = html.replace(reScript, (_) => code)
					} else if (value.fileName.endsWith(".css")) {
						const reCSS = new RegExp(`<link rel="stylesheet"[^>]*?href="/${value.fileName}"[^>]*?>`)
						const code = `<!-- ${a.fileName} --><style type="text/css">\n${a.source}\n</style>`
						html = html.replace(reCSS, (_) => code)
					} else {
						extraCode += "\n<!-- ASSET NOT INLINED: " + a.fileName + " -->\n"
					}
				}
				const reModulepreload = new RegExp(/<link rel="modulepreload" href="\/assets\/style\..*.js">/)
				return html.replace(/<\/body>/, extraCode + "</body>").replace(reModulepreload, '')
			},
		},
	}
}

export default defineConfig({
  plugins: [
		vue(),
		viteSingleFile()
	],
  build: {
		target: "esnext",
		assetsInlineLimit: 100000000,
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		brotliSize: false,
		rollupOptions: {
			inlineDynamicImports: true,
			output: {
				manualChunks: () => "everything.js",
			},
		},
	},
})
