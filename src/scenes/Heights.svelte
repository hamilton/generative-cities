<script>
import { randomBinomial } from 'd3-random';
import Scene from '../primitives/Scene.svelte';
import Earth from '../composites/Earth.svelte';
import Box from '../composites/Box.svelte';
import BuildingPalette01 from '../palettes/BuildingPalette01.svelte';

const grid = false;

const width = 1400;
const rows = 100;
const tileSize = width / rows / 2;

function sample(n = rows, p = 0.5, samples = 1000) {
  const random = randomBinomial(n, p);
  // const random = randomNormal(n / 2, n / 8);
  // const random = randomIrwinHall(n * 2);
  const runs = Array.from({ length: samples }).fill(null).map(() => Math.floor(random()))
    .reduce((acc, v) => {
      if (!(v in acc)) acc[v] = 0;
      acc[v] += 1;
      return acc;
    }, {});
  const output = Object.entries(runs);
  const total = output.reduce((acc, [_, v]) => acc + v, 0);
  return output.map(([k, v]) => [+k, (v) / (total)]);
}

const LL = rows;

const generateColumns = (l = 32) => Array.from({ length: l }).fill(null).map((_, i) => ({
  row: l - i,
  values: sample(100, 0.5, 500),
}));

const cols = generateColumns(LL);

</script>

<div>
    <Scene width={width} tileSize={tileSize} grid={grid}>
        <defs slot='defs'>
            <BuildingPalette01 />
        </defs>
        <g slot='earth'>
            <Earth />
        </g>
            <g>
            {#each cols as {row, values: arr}, i}
                {#each arr as [x,v], j}
                    <Box 
                        x={x} 
                        y={row} 
                        height={v * (Math.abs(LL / 2 - i) + 1)}
                        opacity={Math.sqrt(v) * 2.5}
                        z={10 + Math.random() * 2}
                        castingShadow={false}
                        downwardShadow={true}

                    />
                {/each}
            {/each}
        </g>
    </Scene>
</div>