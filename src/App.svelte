<script>
import { spring } from 'svelte/motion';
import { derived } from 'svelte/store';
import { shuffle } from 'd3-array';
import { fly } from 'svelte/transition';
import { onMount } from 'svelte';
import City from './City.svelte';
import Grass from './Grass.svelte';
import Road from './Road.svelte';
import Building from './Building.svelte';
import Earth from './Earth.svelte';

let grid = false;


const width = 1400;
const height = width / 2;
const rows = 25;
const tileSize = width / rows / 2;

//const nBuildings = Math.pow(rows, 2);
//const rows = Math.floor(width / tileSize / 2);
let P = .1;
let U = 5;


const sortByView = ({x: ax,y: ay},{x: bx, y: by}) => {
	if ((ax <= bx) && (ay >= by)) return -1;
	return 1;
}

let buildings = Array.from({length: Math.pow(rows, 2)}).fill(null).map((_,i) => {
	const x = i % rows;
	const y = Math.floor(i / rows);
	const side = Math.random() > .5 ? 'left' : 'right';
	if (y === 5) return undefined;
	if (Math.random() < P) {
		return {x, y, side, kind: 'building'}
	}
	if (Math.random() < .1) return {x, y, kind: 'tree'}
	return undefined;
}).filter((x)=> x !== undefined)

buildings.sort(sortByView);
if (buildings.length % 5 !== 0) buildings = buildings.slice(0, buildings.length - (buildings.length % 5));
const nBuildings = buildings.length;

const r = (n=nBuildings) => Array.from({length: n}).map(() => 
	({h: Math.random() * 2 + tileSize / rows / 3, b:  3 + Math.random() * (tileSize / 1.5)})
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
	makeSpring(seg, {damping:.45, stiffness:.1}),
];

const widthSet = makeSpring(nBuildings, { damping: .9, stiffness:.1});

const reorder = shuffle(Array.from({length: nBuildings}).map((_,i) => i));

$: springSet.forEach(s=>{ s.set(r(nBuildings/U))});

const sprs = derived(springSet, $springs => {
	const out = $springs.flat();
	return reorder.map(r=> out[r]);
})


// setInterval(() => {
// 	springSet.forEach(s=>{ s.set(r(nBuildings/U))});
// }, 750)

let mounted = false;

onMount(() => {
	mounted = true;
})


</script>

<style>

div {
	display: grid;
	align-items: center;
	justify-items: center;
}

.controls {
	display: fixed;
	left: 16px;
	top: 16px;
	width: max-content;
	color: white;
}
</style>

<div class=controls>
	<label>
		grid
		<input type=checkbox bind:checked={grid} />
	</label>
	<button on:click={()=>{
		springSet.forEach(s=>{ s.set(r(nBuildings/U))});
	}}>randomize</button>
</div>

{#if mounted}
	<div in:fly={{duration: 300, y:-10}}>
		<City width={width} tileSize={tileSize}  grid={grid}>
			<g slot='earth'>
				<Earth />
			</g>
			<Road start={[0, 5]} end={[rows-1, 5]} />
			{#each buildings as {kind, x, y, side}, i}
				{#if kind === 'building'}
					<Building x={x} y={y} buildingHeight={$sprs[i].h} patio={$sprs[i].b} doorSide={side} />
				{:else if kind === 'tree'}
					<Grass x={x} y={y} trunkHeight={$sprs[i].h} />
				{/if}
			{/each}
		</City>
	</div>
{/if}