import postcss from "postcss"
import Color from "../color.js/src/index.js"
import Okhsl from "../color.js/src/spaces/okhsl.js"

function* range(start, end, step = 1) {
	for (let n = start; n <= end; n += step) {
		yield n
	}
}

/**
	* @param {Function} fun
	* @param {number[]} range
	*/
const interpolate = (fun, range) => range.map(fun)

/**
 * @param {...number} coefficients
 */
const poly = (...coefficients) =>
	x => coefficients.reduce((s, k, i) => s + k * x ** i, 0)

const exp = (k = 1, n = 1, c = 0) => x => k * Math.exp(n * x) + c

const normal = (mean, deviate) => x =>
	Math.exp(-0.5 * ((x - mean) / deviate) ** 2)
	/ (deviate * Math.sqrt(2 * Math.PI))

const hue = base => n => base + 5 * (1 - n)
const h = hue(143)
// const s = poly(0, 4, -4)
const s = normal(0.5, 0.25 ** 0.5)
const l = n => 1 - n

const index = x => Math.round(100 * x)
const primary = x => new Color(Okhsl, [h(x), s(x) / s(0.5), l(x)])

const scaleGen = () => ({
	postcssPlugin: 'generateRootStyles',
	Once(tree) {
		const rule = postcss.rule({ selector: ':root' })
		const entries = Array.from(range(0, 1, 0.1), x => [index(x), primary(x)])
		const declarations = entries.map(([index, color]) => postcss.decl({
			prop: `--primary-color-${index}`,
			value: color.to("hsl"),
		}))
		rule.append(...declarations)
		tree.append(rule)
	}
})

postcss([scaleGen()])
	.process('', { from: undefined })
	.then(result => {
		console.log(result.css)
	})
