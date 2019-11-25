<script>
import { getContext } from 'svelte';
export let x;
export let y;
export let trunkHeight;
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
</script>

<g>
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