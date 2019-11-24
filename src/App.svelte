<script>
import { spring } from 'svelte/motion';
import { derived } from 'svelte/store';
import { shuffle } from 'd3-array'
import City from './City.svelte';
import Grass from './Grass.svelte';
import Road from './Road.svelte';
import Building from './Building.svelte';

const nBuildings = 100;
const rows = 16;
let P = .5;
let U = 5;

const r = (n=nBuildings) => Array.from({length: n}).map(() => Math.random() * 2 + .2);
const ww = (n=nBuildings) => Array.from({length:n}).map(() => 4 + Math.random() * 12);

function makeSpring(n=nBuildings, params={damping:.1, stiffness:.05}) {
	return spring(Array.from({length: n}).fill(0), params);
}

const springSet = [
	makeSpring(nBuildings/U, {damping:.6, stiffness:.1}),
	makeSpring(nBuildings/U, {damping:.8, stiffness:.2}),
	makeSpring(nBuildings/U, {damping:.7, stiffness:.1}),
	makeSpring(nBuildings/U, {damping:.9, stiffness:.2}),
	makeSpring(nBuildings/U, {damping:.4, stiffness:.1}),
];

const widthSet = makeSpring(nBuildings, { damping: .9, stiffness:.1});

const reorder = shuffle(Array.from({length: nBuildings}).map((_,i) => i));
$: springSet.forEach(s=>{ s.set(r(nBuildings/U))});
$: widthSet.set(ww(nBuildings))
const sprs = derived(springSet, $springs => {
	const out = $springs.flat();
	return reorder.map(r=> out[r]);
})

const buildingLocations = () => {
	const spots = Array.from({length: nBuildings});
	const g = () => {
		const x = Math.floor(Math.random() * 16);
		const y = Math.floor(Math.random() * 16);
		return [x,y]
	}
	let pairs = [];
	const locs = spots.map((_,i) => {
		// generate pair;
		let [x,y] = g();
		while (pairs.includes(`${x},${y}`)) {
			[x,y] = g();
		}
		pairs.push(`${x},${y}`)
		return [x,y]
	})
	return locs;
}

const sortByView = ([ax,ay],[bx,by]) => {
	if ((ax <= bx) && (ay >= by)) return -1;
	return 1;
}
const buildings = buildingLocations();
buildings.sort(sortByView);

//let tempBuildings = Array.from({length:nBuildings}).map((_,i) => [i % 16, Math.floor(i / 16)]);
let tempBuildings = Array.from({length: rows * rows}).map((_,i) => {
	const x = i % 16;
	const y = Math.floor(i / 16);
	if (y === 5) return undefined;
	if (Math.random() < P) return [x,y]
	return undefined;
}).filter((x)=> x !== undefined)
tempBuildings.sort(sortByView);

setInterval(() => {
	springSet.forEach(s=>{ s.set(r(nBuildings/U))});
	widthSet.set(ww(nBuildings));
}, 1000)

</script>

<style>
div {
	display: grid;
	align-items: center;
	justify-items: center;
}
</style>

<div>
	<City width={800} height={800}>
		<!-- {#each Array.from({length: rows}).fill(null) as _, i} -->
			<Road start={[0,5]} end={[rows-1,5]} />
		<!-- {/each} -->
		{#each tempBuildings as [x,y], i}
			<Building x={x} y={y} buildingHeight={$sprs[i]} patio={$widthSet[i]} />
		{/each}
	</City>
</div>