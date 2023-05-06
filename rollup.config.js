import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import json from '@rollup/plugin-json'
import { babel } from '@rollup/plugin-babel'
import autoExternal from 'rollup-plugin-auto-external'
import typescript from '@rollup/plugin-typescript'
import bundleSize from 'rollup-plugin-bundle-size'
import path from 'path'

const lib = {

}
const outputFileName = 'sAxios'
const name = "sAxios"
const namedInput = './index.ts'
const defaultInput = './lib/index.ts'

const buildConfig = ({ es5, browser = true, minifiedVersion = true, ...config }) => {
	const { file } = config.output
	const ext = path.extname(file)
	const basename = path.basename(file, ext)
	const extArr = ext.split('.')
	extArr.shift()
	console.log(config.output, 'config.output')

	const build = ({ minified }) => ({
		input: namedInput,
		...config,
		output: {
			...config.output,
		},
		plugins: [
			json(),
			resolve({ browser }),
			commonjs(),
			// typescript({
			// 	sourceMap: false
			// }),
			minified && terser(),
			minified && bundleSize(),
			...(es5 ? [babel({
				babelHelpers: 'bundled',
				extensions: ['.ts'],
				presets: ['@babel/preset-env']
			})] : []),
			...(config.plugins || []),
		]
	})

	const configs = [
		build({ minified: false }),
	]

	return configs
}

export default async () => {
	const year = new Date().getFullYear()
	const banner = `// Saxios v${lib.version} Copyright (c) ${year} ${lib.author} and contributors`

	const config = buildConfig({
		input: defaultInput,
		es5: true,
		output: {
			dir: "dist",
			file: `${outputFileName}.js`,
			name,
			format: "umd",
			exports: "default",
			banner
		}
	})

	console.log(config)
	return [
		// Browser UMD bundle for CDN
		...config
	]
}
