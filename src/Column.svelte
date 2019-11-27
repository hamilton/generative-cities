<script>
import Grass from './Grass.svelte';
import Side from './Side.svelte';
import { fly } from 'svelte/transition';
import { getContext } from 'svelte';
import { makePoints } from './coords.js'
import { shuffle } from 'd3-array';
export let windows = false;
export let x;
export let y;
export let bottomHeight = 0;
export let buildingHeight;
export let buffer = 0.05;
export let doorSide = 'right';
export let angle = 0;
export let opacity = 1;

const tileSize = getContext('tileSize');
const width = getContext('width');
const height = getContext('height');
const tileDimensions = getContext('tileDimensions');
const coords = getContext('coords');
const scale = getContext('scale');
const rotate = getContext('rotate');

const orientation = shuffle(['left', 'right', 'top', 'bottom', 'center']);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;
const doorWidth = tileDimensions / 6;
const doorHeight = tileDimensions / 4;

let BH = buildingHeight * H;
$: BH = buildingHeight * H;

const storyHeight = doorHeight + 1.2;
let buildingWidth;
$: buildingWidth = 1 - buffer * 2;


const floorCenter = scale(x+.5, y+.5);

let _xl, _yl;
let _x0, _y0;
let _xb, _yb;
let _xr, _yr;
let _xt, _yt;
$: [_x0, _y0] = rotate(...scale(x, y), angle, floorCenter);
$: [_xl, _yl] = rotate(...scale(x + buffer, y + buffer), angle, floorCenter);
$: [_xb, _yb] = rotate(...scale(x + 1 - buffer, y + buffer), angle, floorCenter);
$: [_xr, _yr] = rotate(...scale(x + 1 - buffer, y + 1 - buffer), angle, floorCenter);
$: [_xt, _yt] = rotate(...scale (x + buffer, y + 1 - buffer), angle, floorCenter);

let floor = {};
$: floor = {
    lx: _xl, ly:_yl,
    rx: _xr, ry:_yr,
    bx: _xb, by:_yb,
    tx: _xt, ty:_yt,
}

const leftSide = (floor, BH) => `
${floor.lx},${floor.ly } 
${floor.lx},${floor.ly - BH} 
${floor.bx},${floor.by - BH } 
${floor.bx},${floor.by}`

const rightBack = (floor, BH) => `
${floor.rx},${floor.ry} 
${floor.rx},${floor.ry - BH} 
${floor.tx},${floor.ty - BH} 
${floor.tx},${floor.ty}`


// const singleShadow = (floor, BH) => `
// ${floor.bx},${floor.by - bottomHeight} 
// ${floor.bx + BH},${floor.by + BH / 2 - bottomHeight}
// ${floor.rx + BH},${floor.ry + BH / 2 - bottomHeight} 
// ${floor.rx},${floor.ry} 
// ${floor.rx + BH},${floor.ry + BH / 2 - bottomHeight} 
// ${floor.tx + BH},${floor.ty + BH / 2 - bottomHeight}
// ${floor.tx},${floor.ty}
// `

const groundShadow = (floor, BH) => `
${floor.lx},${floor.ly} 
${floor.tx},${floor.ty} 
${floor.rx},${floor.ry} 
${floor.bx},${floor.by} 
`

const rightSide = (floor, BH) => `
${floor.rx},${floor.ry - BH} 
${floor.rx},${floor.ry} 
${floor.bx},${floor.by}
${floor.bx},${floor.by  - BH} 
`;

const topSide = (floor, BH) => `
${floor.lx},${floor.ly - BH} 
${floor.tx},${floor.ty - BH} 
${floor.rx},${floor.ry - BH} 
${floor.bx},${floor.by - BH}`;

let doorXs;
let doorYs;
let doorXe;
let doorYe;



$: [doorXs, doorYs] = doorSide === 'right' ? 
    rotate(...scale (x + .5 - .05, y + buffer), angle, floorCenter) :
    rotate(...scale (x + 1 - buffer, y + .5 - .05), angle, floorCenter);
$: [doorXe, doorYe] = doorSide === 'right' ? 
    rotate(...scale (x + .5 + .05, y + buffer), angle, floorCenter) :
    rotate(...scale (x + 1 - buffer, y + .5 + .05), angle, floorCenter);

let door;
$: door = `
${doorXs},${doorYs} 
${doorXs},${doorYs - doorHeight} 
${doorXe},${doorYe - doorHeight} 
${doorXe},${doorYe} 
`
let nStories = 0;
let stories = [];
$: nStories = Math.min(50, Math.floor(BH / storyHeight) - 1);
$: stories = Array.from({ length:nStories}).fill(null);


let nWindows = 0;
let windowSize = .075;
let windowBuffer = .05;
let windowOffset = 0;
$: nWindows = Math.min(
    Math.floor((buildingWidth) / (windowSize + windowBuffer)) - 1, 10);
$: windowOffset = (buildingWidth - nWindows * windowSize - (nWindows-1) * windowBuffer) / 2;

$: f1 = +(doorSide === 'right');

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

</style>

<g opacity={opacity}>
        <polygon class=top points={groundShadow(floor, BH)} fill="rgba(0,0,0,.1)" />
    </g>

<g class=s01 opacity={opacity} style="transform:translateY({-bottomHeight}px)">
    <!-- <polygon points={singleShadow(floor, BH)} fill=url(#shadow) clip-path="url(#shadow-clip)" /> -->    
    <polygon class=right-back points={rightBack(floor, BH)} fill="url(#right-back)" />
    <polygon class=left points={leftSide(floor, BH)} fill=url(#left)  />
    <polygon class=right points={rightSide(floor, BH)} fill="url(#right)" />
    <polygon class=top points={topSide(floor, BH)} fill="url(#top)" />
</g>

