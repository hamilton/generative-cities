<script>
import { tweened } from 'svelte/motion';
import { cubicOut, bounceIn } from 'svelte/easing';
import Scene from '../primitives/Scene.svelte';
import Earth from '../composites/Earth.svelte';
import Box from '../composites/Box.svelte';
import BuildingPalette01 from '../palettes/BuildingPalette01.svelte';

const width = 1400;
const rows = 25;
const tileSize = width / rows / 2;

const T = 300;

const P = 0.1;

const sortByView = ([ax, ay], [bx, by]) => {
  const aax = Math.floor(ax);
  const aay = Math.floor(ay);
  const bbx = Math.floor(bx);
  const bby = Math.floor(by);
  if ((aax <= bbx) && (aay >= bby)) return -1;
  return 1;
};

const spr = tweened(0, { duration: T, easing: cubicOut });

$: spr.set(1);

const k = 0.3;

const randomizeArrayElement = (x, y, i, K = k) => {
  const rx = 0.1 + Math.random() / 4;
  const ry = rx;// K +  Math.random() / 2;
  const rxw = rx * 2; // K +  Math.random() / 2;
  const ryw = rxw; // K +  Math.random() / 2;
  const rz = K + Math.random();
  const ra = K + Math.random();
  return [x, y, rx, ry, 1 - rxw, 1 - ryw, rz, ra];
};

const makeArray = (p = P) => Array.from({ length: rows * rows }).fill(null).map((_, i) => {
  if (Math.random() > p) return undefined;
  const x = i % rows;
  const y = Math.floor(i / rows);
  return randomizeArrayElement(x, y, i);
}).filter((v) => v !== undefined);

const homes = makeArray();
homes.sort(sortByView);
const homesStore = tweened(homes, { duration: T, easing: cubicOut });

$: homesStore.update((h) => h.map(([x, y], i) => randomizeArrayElement(x, y, i)));

let angle = 0;// tweened(0, { duration: 500, easing: cubicOut });
let overallHeight = 0;

// setInterval(() => {
//   angle.update((a) => (a === 0 ? Math.PI / 4 : 0));
//   homesStore.update((h) => h.map(([x, y], i) => randomizeArrayElement(x, y, i)));
// }, 1000);

</script>

<div>
    <Scene width={width}
        tileSize={tileSize} 
        grid={false}
        let:placeX={placeX}
        let:placeY={placeY}
    >

        <defs slot='defs'>
            <BuildingPalette01 />
        </defs>

        <g slot='earth'>
            <Earth />
        </g>

        {#each $homesStore as [x, y, rx, ry,  w, h, height, a], i}
            
            <Box 
                x={x + rx}
                y={y + ry}
                xLength={w} 
                yLength={h}
                height={$spr * height + overallHeight}
                angle={angle * a}
            />

        {/each}

    </Scene>
</div>

<div class=scene-controls>
  <label> rotation
    <input type=range bind:value={angle} min={0} max={Math.PI / 4} step={0.005}>
  </label>
  <label> general height
    <input type=range bind:value={overallHeight} min={0} max={3} step={0.01}>
  </label>
  <button on:click={() => {
      homesStore.update((h) => h.map(([x, y], i) => randomizeArrayElement(x, y, i)));
}}>
  randomize
  </button>
</div>
    