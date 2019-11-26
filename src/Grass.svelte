<script>
import { getContext } from 'svelte';
export let x;
export let y;
export let trunkHeight;
export let buffer = .4 * Math.random();
const tileSize = getContext('tileSize', tileSize);
const width = getContext('width', width);
const height = getContext('height', height);
const tileDimensions = getContext('tileDimensions', tileDimensions);
const coords = getContext('coords');
const scale = getContext('scale');

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;

const points = Array.from({length: Math.ceil(Math.random() * 20)}).map(() => {
	return scale(x + Math.random(), y + Math.random());
})

const toCoord = obj => `${obj.lx},${obj.ly} ${obj.tx},${obj.ty} ${obj.rx},${obj.ry} ${obj.bx},${obj.by}`
const tree = scale(x + Math.random(), y + Math.random());
//const h = 10 + Math.random() * 5;

const KEY = `${Math.floor(Math.random() * 100000000)}`
const mult = 10;
let h;
$: h = 2 + trunkHeight * mult;

const outer = coords(x, y);

const rectangle = (lx, ly, rx, ry, tx, ty, bx, by, lh=0, rh=0, th=0, bh=0) => {
	const [_lx, _ly] = scale(lx, ly, lh);
	const [_rx, _ry] = scale(rx, ry, rh);
	const [_tx, _ty] = scale(tx, ty, th);
	const [_bx, _by] = scale(bx, by, bh);
	return {
		lx: _lx, ly: _ly,
		rx: _rx, ry: _ry,
		tx: _tx, ty: _ty,
		bx: _bx, by: _by,
	}
}
let inner = {};
let K = trunkHeight + 10;
$: K = trunkHeight + 10;
$: inner = rectangle(
	x + buffer,  // left
	y + buffer,  // left
	x + 1 - buffer,  // right
	y + 1 - buffer,  // right
	x + buffer,  // top
	y + 1 - buffer,   // top
	x + 1 - buffer,   // bot
	y + buffer,   // bot
	K,K,K,K);

</script>

<g>
	<polygon 
		points={`
			${inner.lx},${inner.ly} 
			${inner.bx},${inner.by} 
			${inner.rx},${inner.ry} 
			${inner.tx},${inner.ty} 
		`} fill='green'
	/>
	<polygon 
	points={`
		${outer.lx},${outer.ly} 
		${inner.lx},${inner.ly} 
		${inner.bx},${inner.by} 
		${outer.bx},${outer.by} 
	`} fill='darkgreen'
/>

	<!-- <rect 
		x={tree[0] - 1} y={tree[1] - h} width={2} height={h} fill=#333333
	/>
	<ellipse 
		cx={tree[0]} cy={tree[1]} rx=1 ry=1 fill=#333333
	/>
	<ellipse 
		cx={tree[0]} cy={tree[1] - h} rx=3 ry=3 fill=url(#treetop)
	/> -->
	<!-- <polygon points={toCoord(coords(x,y))} fill=darkgreen opacity=.3 /> -->
	<!-- {#each points as [x,y]}
		<circle cx={x} cy={y} fill=#679267 r={1 + Math.random() } opacity=.2 />
	{/each} -->
</g>