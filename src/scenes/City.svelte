<script>
import { spring } from 'svelte/motion';
import { derived } from 'svelte/store';
import { shuffle } from 'd3-array';
import { fly } from 'svelte/transition';
import { onMount } from 'svelte';
import Scene from '../Scene.svelte';
import Grass from '../Grass.svelte';
import Road from '../Road.svelte';
import Building from '../Building.svelte';
import Earth from '../Earth.svelte';
import Orb from '../Orb.svelte';

let grid = false;
let windows = false;
let radians = Math.random();
let heightMultiplier = 1;


const width = 1400;
const height = width / 2;
const rows = 25;
const tileSize = width / rows / 2;

let P = .1;
let U = 5;

const sortByView = ({x: ax,y: ay},{x: bx, y: by}) => {
    if ((ax <= bx) && (ay >= by)) return -1;
    return 1;
}

////////// BUILDING

let buildings = Array.from({length: Math.pow(rows, 2)}).fill(null).map((_,i) => {
    const x = i % rows;
    const y = Math.floor(i / rows);
    const side = Math.random() > .5 ? 'left' : 'right';
    if (y === 5) return undefined;
    if (Math.random() < P) {
        return {x, y, side, kind: 'building'}
    }
    if (Math.random() < .01) return {x, y, kind: 'tree'}
    return undefined;
}).filter((x)=> x !== undefined);

buildings.sort(sortByView);
if (buildings.length % 5 !== 0) buildings = buildings.slice(0, buildings.length - (buildings.length % 5));

const nBuildings = buildings.length;

///////// SPRINGS

const r = (n=nBuildings) => Array.from({length: n}).map(() => 
    ({h: Math.random() * 2 + tileSize / rows / 2, b:  .2 + Math.random() / 5})
);

function makeSpring(n=nBuildings, params={damping:.1, stiffness:.05}) {
    return spring(Array.from({length: n}).fill({h:1, b: 1}), params);
}
const seg = nBuildings / U;

const springSet = [
    makeSpring(seg, {damping:.6, stiffness:.3}),
    makeSpring(seg, {damping:.8, stiffness:.4}),
    makeSpring(seg, {damping:.7, stiffness:.3}),
    makeSpring(seg, {damping:.6, stiffness:.2}),
    makeSpring(seg, {damping:.85, stiffness:.2}),
];

const widthSet = makeSpring(nBuildings, { damping: .9, stiffness:.1});

const reorder = shuffle(Array.from({length: nBuildings}).map((_,i) => i));

$: springSet.forEach(s=>{ s.set(r(nBuildings/U), { hard: true })});

const sprs = derived(springSet, $springs => {
    const out = $springs.flat();
    return reorder.map(r=> out[r]);
})

let d = (n=nBuildings) => Array.from({length: n}).map(() => Math.random() * Math.PI / 4);
let degrees = spring(d(), {damping: .6, stiffness: .1});

let mounted = false;

onMount(() => {
    mounted = true;
})


</script>

<style>



.controls {
    position: fixed;
    left: 16px;
    top: 16px;
    width: max-content;
    color: white;
}
</style>

{#if mounted}
        <Scene width={width} tileSize={tileSize} grid={grid}>
            <g slot='earth'>
                <Earth />
            </g>
            <Road start={[0, 5]} end={[rows-1, 5]} />
            {#each buildings as {kind, x, y, side}, i (`${x},${y},${kind},${side}`)}
                {#if kind === 'building'}
                    <Building 
                        x={x} 
                        y={y} 
                        buildingHeight={$sprs[i].h * heightMultiplier} buffer={$sprs[i].b} 
                        doorSide={side} 
                        windows={windows}
                        angle={$degrees[i] * radians} />
                {:else if kind === 'tree'}
                    <!-- <Grass x={x} y={y} trunkHeight={$sprs[i].h} buffer={$sprs[i].b} /> -->
                    <!-- <Orb x={x} y={y} h={$sprs[i].h * 10} r={$sprs[i].b * 30} /> -->
                {/if}
            {/each}
        </Scene>
{/if}

<div class=controls>
    <label>
        grid
        <input type=checkbox bind:checked={grid} />
    </label>
    <label>
        windows
        <input type=checkbox bind:checked={windows} />
    </label>
    <button on:click={()=>{
        springSet.forEach(s=>{ s.set(r(nBuildings/U))});
        degrees.set(d());

    }}>resize</button>

    <input type="range" bind:value={radians} 
    min={0} max={1} step={.01}>
    {radians}

    <input type="range" bind:value={heightMultiplier} 
    min={1} max={2.5} step={.01}>
    {heightMultiplier}
</div>