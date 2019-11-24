<script>
import { getContext } from 'svelte';
import { makePoints } from './coords.js'
export let x;
export let y;
const tileSize = getContext('tileSize', tileSize);
const width = getContext('width', width);
const height = getContext('height', height);
const tileDimensions = getContext('tileDimensions', tileDimensions);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;

const points = makePoints(height, W, H);
const toCoord = obj => `${obj.lx},${obj.ly} ${obj.tx},${obj.ty} ${obj.rx},${obj.ry} ${obj.bx},${obj.by}`
</script>

<g>
	<polygon points={toCoord(points(x,y))} fill=#004C54 />
</g>