<script>
import { spring, tweened } from 'svelte/motion';
import { cubicOut as easing } from 'svelte/easing';
import { derived } from 'svelte/store';
import { shuffle } from 'd3-array';
import { fly } from 'svelte/transition';
import { onMount } from 'svelte';
import Scene from '../Scene.svelte';
import Grass from '../Grass.svelte';
import Road from '../Road.svelte';
import Building from '../Building.svelte';
import Earth from '../Earth.svelte';
import Disk from '../Disk.svelte';
import Column from '../Column.svelte';
import { randomBinomial, randomNormal, randomIrwinHall } from 'd3-random';

let grid = false;
let windows = false;
let radians = Math.random();
let heightMultiplier = 1;

const width = 1400;
const height = width / 2;
const rows = 100;
const tileSize = width / rows / 2;

let P = .1;
let U = 5;

const sortByView = ({x: ax,y: ay},{x: bx, y: by}) => {
    if ((ax <= bx) && (ay >= by)) return -1;
    return 1;
}

const spr = tweened(0, {duration: 3000});

setInterval(() => {
    spr.set(1);
}, 1000)

let mounted = false;

onMount(() => {
    mounted = true;
});

function sample(n = rows, p=.5, samples = 1000) {
    const random = randomBinomial(n, p);
    //const random = randomNormal(n / 2, n / 8);
    //const random = randomIrwinHall(n * 2);
    let runs = Array.from({length: samples}).fill(null).map(() => Math.floor(random()))
        .reduce((acc,v) => {
        if (!(v in acc)) acc[v] = 0;
        acc[v] += 1;
        return acc;
    }, {});
    let output = Object.entries(runs);
    const total = output.reduce((acc, [_,v]) => acc+v,0);
    return output.map(([k,v]) => [+k, (v) / (total)])
}

const LL = rows;

let generateColumns = (l=32) => {
    return Array.from({length: l}).fill(null).map((_,i) => {
        return {
            row: l-i,
            values: sample(100, .5, 100)
        }
    })
}

let cols = generateColumns(LL);

</script>

<div>
    <Scene width={width} tileSize={tileSize} grid={grid}>
        <g slot='earth'>
            <Earth />
        </g>
        <!-- <g style="transform:translateY({-$spr * 40}px)"> -->
            <g>
            {#each cols as {row, values: arr}, i}
                {#each arr as [x,v], j}
                    <Column 
                        x={x} 
                        y={row} 
                        r={tileSize / 2}
                        opacity={Math.sqrt(v) * 2.5}
                        bottomHeight={150 - v * 10 * (Math.abs(LL / 2-i) + 1)}
                        buildingHeight={v * 5 * (Math.abs(LL / 2-i) + 1)}
                    />
                {/each}
            {/each}
        </g>
    </Scene>
</div>