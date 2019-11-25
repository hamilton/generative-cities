<script>
import Grass from './Grass.svelte';
import { getContext } from 'svelte';
import { makePoints } from './coords.js'
import { shuffle } from 'd3-array';
export let x;
export let y;
export let buildingHeight;
export let patio = 8;
export let doorSide = 'right';

const tileSize = getContext('tileSize');
const width = getContext('width');
const height = getContext('height');
const tileDimensions = getContext('tileDimensions');
const coords = getContext('coords');
const scale = getContext('scale');

const orientation = shuffle(['left', 'right', 'top', 'bottom', 'center']);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;
const doorWidth = tileDimensions / 6;
const doorHeight = tileDimensions / 6;
//const points = makePoints(height, W, H);

const placement = coords(x,y);
let BH = buildingHeight * H;
$: BH = buildingHeight * H;

const leftSide = (obj, BH) => `
${obj.lx + patio},${obj.ly} 
${obj.lx + patio},${obj.ly - BH} 
${obj.tx},${obj.by  - BH - patio/2} 
${obj.bx},${obj.by - patio / 2}`

const rightSide = (obj, BH) => `${obj.bx},${obj.by - patio / 2} ${obj.rx - patio},${obj.ry} ${obj.rx - patio},${obj.ly  - BH} ${obj.tx},${obj.by - BH - patio/2}`
const topSide = (obj, BH) => `${obj.lx + patio},${obj.ly - BH} ${obj.tx},${obj.ty - BH + patio/2} ${obj.rx - patio},${obj.ry - BH} ${obj.bx},${obj.by - BH - patio/2}`;

const shadow = (obj, BH) => `
${obj.bx},${obj.by - patio / 2} 
${obj.rx - patio},${obj.ry} 
${obj.rx + BH - patio},${obj.ry + BH / 2} 
${obj.bx + BH},${obj.by + BH / 2 - patio / 2}`
let doorXs;
let doorYs;
let doorXe;
let doorYe;

$: [doorXs, doorYs] = doorSide === 'right' ? 
    scale(x + 1 - patio / W / 2, y + .5 - doorHeight / H / 6) : 
    scale(x + .5 - doorWidth / W / 3, y + patio / H / 4);

$: [doorXe, doorYe] = doorSide === 'right' ? 
    scale(x + 1 - patio / W / 2, y + .5 + doorHeight / H / 6) :
    scale(x + .5 + doorWidth / W / 3, y + patio / H / 4);

    let door;

$: door = `
${doorXs},${doorYs} 
${doorXs},${doorYs - doorHeight} 
${doorXe},${doorYe - doorHeight} 
${doorXe},${doorYe} `

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
    <polygon class=left points={leftSide(placement, BH)} fill=url(#left)  />
    <polygon class=right points={rightSide(placement, BH)} fill="url(#right)" />
    <polygon class=top points={topSide(placement, BH)} fill="url(#top)" />
    <polygon  points={door} fill={doorSide === 'left' ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.3)" } />
    <polygon points={shadow(placement, BH)} fill=url(#shadow) clip-path="url(#shadow-clip)" />
</g>