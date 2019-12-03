<script>
import { tweened } from 'svelte/motion';
import { sineOut as up, sineIn as down } from 'svelte/easing';
import { interpolateMagma } from 'd3-scale-chromatic';
import Scene from '../primitives/Scene.svelte';
import Circle from '../primitives/Circle.svelte';
import Earth from '../composites/Earth.svelte';

const width = 1400;
const rows = 15;
const tileSize = width / rows / 2;

const randomCircle = (x, y, s) => [
  Math.max(0, Math.min(rows - 0.5, x + Math.random() - 0.5)),
  Math.max(0, Math.min(rows - 0.5, y + Math.random() - 0.5)),
  s ? 0 : Math.random() * 2,
  ...Array.from({ length: 2 })
    .fill(0.3 + (Math.random() * 0.7) * ((rows - x) / rows)).flatMap((v) => [
      s ? 0.05 : v, 1 - (0.05 + v * 0.6)]),
];

const T = 400;
const D = T;
const U = T;

const makeCircles = (y, s = false) => Array.from({ length: rows })
  .map((_, i) => randomCircle(i, y, s));
const circles = tweened(Array.from({ length: rows })
  .map((_, i) => makeCircles(rows - i - 1, true)), { duration: T, down });
const tw = tweened(0, { duration: 800, up });
let s = false;


setInterval(() => {
  tw.set(s ? 0 : 1);
  circles.set(Array.from({ length: rows }).map((_, i) => makeCircles(rows - i - 1, !s)), { duration: s ? U : D, easing: s ? up : down });
  s = !s;
}, T);

$: tw.set(1);
</script>


<Scene
    width={width}
    tileSize={tileSize}
    grid={false}
>
    <g slot='earth'>
        <Earth />
    </g>

    {#each $circles as row}
        {#each row as [x,y,z,r,c]}
            <Circle 
                x={x + 0.5}
                y={y + 0.5}
                z={0}
                r={r}
                fill=black
                opacity=.2
            />
            <Circle 
                x={x + 0.5}
                y={y + 0.5}
                z={z}
                r={r}
                fill={interpolateMagma(c)}
            />
        {/each}
    {/each}

</Scene>