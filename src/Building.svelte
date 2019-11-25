<script>
import Grass from './Grass.svelte';
import { getContext } from 'svelte';
import { makePoints } from './coords.js'
import { shuffle } from 'd3-array';
export let x;
export let y;
export let buildingHeight;
export let buffer = .1;
export let doorSide = 'right';
export let angle = 0;

const tileSize = getContext('tileSize');
const width = getContext('width');
const height = getContext('height');
const tileDimensions = getContext('tileDimensions');
const coords = getContext('coords');
const scale = getContext('scale');

const orientation = shuffle(['left', 'right', 'top', 'bottom', 'center']);

const H = height / 2 / tileDimensions;
const W = width / 2 / tileDimensions;
const doorWidth = tileDimensions / 4;
const doorHeight = tileDimensions / 4;
//const points = makePoints(height, W, H);

let BH = buildingHeight * H;
$: BH = buildingHeight * H;


const rotate = (x, y, rad) => {
    const k = 2;
    const x1 = x * Math.cos(rad) - y * Math.sin(rad) * k;
    const y1 = (x / k) * Math.sin(rad) + y * Math.cos(rad);
    return [x1, y1];
}

const rotateEdge = (originalObj, rad, centroid) => {
    const obj = {...originalObj};
    const [lx, ly] = rotate(obj.lx - centroid[0], obj.ly - centroid[1], rad);
    const [rx, ry] = rotate(obj.rx  - centroid[0], obj.ry - centroid[1], rad);
    const [tx, ty] = rotate(obj.tx  - centroid[0], obj.ty - centroid[1], rad);
    const [bx, by] = rotate(obj.bx - centroid[0], obj.by - centroid[1], rad);
    obj.lx = lx + centroid[0];
    obj.ly = ly + centroid[1];
    obj.rx = rx + centroid[0];
    obj.ry = ry + centroid[1];
    obj.tx = tx + centroid[0];
    obj.ty = ty + centroid[1];
    obj.bx = bx + centroid[0];
    obj.by = by + centroid[1];
    return obj;
}

const floorCenter = scale(x+.5, y+.5);

let floor  = rotateEdge(coords(x,y), angle, floorCenter);
$: floor = rotateEdge(coords(x,y), angle, floorCenter)

let patio;
$: patio = buffer * W;

const leftSide = (floor, BH) => `
${floor.lx + patio},${floor.ly} 
${floor.lx + patio},${floor.ly - BH} 
${floor.bx},${floor.by - patio / 2 - BH} 
${floor.bx},${floor.by - patio / 2}`

const rightBack = (floor, BH) => `
${floor.rx - patio},${floor.ry} 
${floor.rx - patio},${floor.ry - BH} 
${floor.tx},${floor.ty - BH + patio / 2} 
${floor.tx},${floor.ty + patio / 2}`


// hidden when angle === 0
// const leftShadow = (floor, BH) => `
// ${floor.tx},${floor.ty + patio / 2} 
// ${floor.rx - patio},${floor.ry} 
// ${floor.rx + BH - patio},${floor.ry + BH}
// ${floor.tx + BH},${floor.ty + BH - patio / 2}`;

// const leftShadow = (floor, BH) => `
// ${floor.rx - patio},${floor.ry} 
// ${floor.rx - patio + BH},${floor.ry + BH / 2} 
// ${floor.tx + BH},${floor.ty + BH / 2 + patio / 2}
// ${floor.tx},${floor.ty + patio / 2}  
// `;

// main right face shadow, 
// const rightShadow = (floor, BH) => `
// ${floor.bx},${floor.by - patio / 2} 
// ${floor.rx - patio},${floor.ry} 
// ${floor.rx + BH - patio},${floor.ry + BH / 2} 
// ${floor.bx + BH},${floor.by + BH / 2 - patio / 2}`;

const singleShadow = (floor, BH) => `
${floor.bx},${floor.by - patio / 2} 
${floor.bx + BH},${floor.by + BH / 2 - patio / 2}
${floor.rx + BH - patio},${floor.ry + BH / 2} 
${floor.rx - patio},${floor.ry} 
${floor.rx - patio + BH},${floor.ry + BH / 2} 
${floor.tx + BH},${floor.ty + BH / 2 + patio / 2}
${floor.tx},${floor.ty + patio / 2}

`

const rightSide = (floor, BH) => `
${floor.rx - patio},${floor.ry - BH} 
${floor.rx - patio},${floor.ry} 
${floor.bx},${floor.by - patio/2}
${floor.bx},${floor.by  - BH - patio/2} 
`;

const topSide = (floor, BH) => `
${floor.lx + patio},${floor.ly - BH} 
${floor.tx},${floor.ty - BH + patio/2} 
${floor.rx - patio},${floor.ry - BH} 
${floor.bx},${floor.by - BH - patio/2}`;



let doorXs;
let doorYs;
let doorXe;
let doorYe;

// $: [doorXs, doorYs] = doorSide === 'right' ? 
//     scale(x + 1 - patio / W / 2, y + .5 - doorHeight / H / 6) : 
//     scale(x + .5 - doorWidth / W / 3, y + patio / H / 4);

// $: [doorXe, doorYe] = doorSide === 'right' ? 
//     scale(x + 1 - patio / W / 2, y + .5 + doorHeight / H / 6) :
//     scale(x + .5 + doorWidth / W / 3, y + patio / H / 4);

function rotateScale(x, y, rad, centroid) {
    let [xi , yi] = scale(x, y);
    const [lx, ly] = rotate(xi - centroid[0], yi - centroid[1], rad);
    return [lx + centroid[0], ly + centroid[1]]
}

$: [doorXs, doorYs] = 
    rotateScale(x + 1, y, angle, floorCenter);

$: [doorXe, doorYe] =
    rotateScale(x + 1, y + 1, angle, floorCenter);


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

</style>

<g class=s01>
    <!-- <polygon points={rightShadow(floor, BH)} fill=url(#shadow) clip-path="url(#shadow-clip)" /> -->
    <polygon points={singleShadow(floor, BH)} fill=url(#shadow) clip-path="url(#shadow-clip)" />
    <!-- <polygon points={leftShadow(floor, BH)} fill=url(#shadow) clip-path="url(#shadow-clip)" /> -->
    <polygon class=right-back points={rightBack(floor, BH)} fill="url(#right-back)" />
    <polygon class=left points={leftSide(floor, BH)} fill=url(#left)  />
    <polygon class=right points={rightSide(floor, BH)} fill="url(#right)" />
    <polygon class=top points={topSide(floor, BH)} fill="url(#top)" />
    <!-- <polygon  points={door} fill={doorSide === 'left' ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.3)" } /> -->
</g>