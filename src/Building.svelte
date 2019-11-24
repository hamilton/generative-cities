<script>
import Grass from './Grass.svelte';
import { getContext } from 'svelte';
import { makePoints } from './coords.js'
export let x;
export let y;
export let buildingHeight;
export let patio = 8;
const tileSize = getContext('tileSize', tileSize);
const width = getContext('width', width);
const height = getContext('height', height);
const tileDimensions = getContext('tileDimensions', tileDimensions);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;
const points = makePoints(height, W, H);

const coords = points(x,y);
let BH = buildingHeight * H;
$: BH = buildingHeight * H;
const leftSide = (obj, BH) => `${obj.lx + patio},${obj.ly} ${obj.lx + patio},${obj.ly - BH} ${obj.tx},${obj.by  - BH - patio/2} ${obj.bx},${obj.by - patio / 2}`
const rightSide = (obj, BH) => `${obj.bx},${obj.by - patio /2} ${obj.rx - patio},${obj.ry} ${obj.rx - patio},${obj.ly  - BH} ${obj.tx},${obj.by - BH - patio/2}`
const topSide = (obj, BH) => `${obj.lx + patio},${obj.ly - BH} ${obj.tx},${obj.ty - BH + patio/2} ${obj.rx - patio},${obj.ry - BH} ${obj.bx},${obj.by - BH - patio/2}`;



</script>

<style>
.s01{
    --top: #ff6f91;
    --left: #d65db1;
    --right:#845ec2;
}

.s02 {
    --top: linear-gradient(to bottom, #c25e5e, #aa5674);
    --left: linear-gradient(to bottom, #875580, #60547d);
    --right: linear-gradient(to bottom, #40506e, #2f4858);
}

polygon {
    /* stroke: var(--right); */
}

.left {
    /* fill: var(--left); */
}

.right {
    /* fill: var(--right); */
}

.top {
    /* fill: var(--top); */
}

</style>

<g class=s01>
    <polygon class=left points={leftSide(coords, BH)} fill=url(#left)  />
    <polygon class=right points={rightSide(coords, BH)} fill="url(#right)" />
    <polygon class=top points={topSide(coords, BH)} fill="url(#top)" />
</g>