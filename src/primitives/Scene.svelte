<script>
import { setContext } from 'svelte';
import { fly } from 'svelte/transition';
import { cubicOut as easing } from 'svelte/easing';

export let width = 500;
export let tileSize = 25;
export let margin = 100;
export let grid = true;

const tileDimensions = width / tileSize / 2;

const H = width / 4 / tileDimensions;
const W = width / 2 / tileDimensions;

const coords = (cx, cy, h = 0) => ({
  lx: cx * W + cy * W,
  ly: margin + width / 4 + cx * (H) - cy * (H) - h,
  tx: cx * W + cy * W + W,
  ty: margin + width / 4 + cx * (H) - cy * (H) - H - h,
  rx: cx * W + cy * W + W * 2,
  ry: margin + width / 4 + cx * (H) - cy * (H) - h,
  bx: cx * W + cy * W + W,
  by: margin + width / 4 + cx * (H) - cy * (H) - H + H * 2 - h,
});

const scale = (cx, cy, h = 0) => {
  const obj = coords(cx, cy, h);
  return [obj.lx, obj.ly];
};

// map* makes the transformation from x/y/z -> iso space
const mapX = (x, y, z = 0) => (x + y) * W;
const mapY = (x, y, z = 0) => (x - y - z * 2) * H;
const mapXY = (x, y, z = 0) => [mapX(x, y, z), mapY(x, y, z)];
// place* helps place the object into the scene

const placeX = (x, y, z = 0) => mapX(x, y, z);
const placeY = (x, y, z = 0) => margin + width / 4 + mapY(x, y, z);
const placeXY = (x, y, z = 0) => [placeX(x, y, z), placeY(x, y, z)];

const rotate = (x, y, rad, centroid = [0, 0]) => {
  const k = 2;
  const x1 = (x - centroid[0]) * Math.cos(rad) - (y - centroid[1]) * Math.sin(rad) * k;
  const y1 = ((x - centroid[0]) / k) * Math.sin(rad) + (y - centroid[1]) * Math.cos(rad);
  return [x1 + centroid[0], y1 + centroid[1]];
};


const mapToScene = (x, y, z = 0, angle = 0, centroid = [0.5, 0.5]) => {
  const x1 = mapX(x, y);
  const y1 = mapY(x, y);
  const c = mapXY(...centroid);
  const [rx, ry] = rotate(x1, y1, angle, c);
  return [rx, ry - z * 2 * H];
};

setContext('tileSize', tileSize);
setContext('width', width);
setContext('height', width / 2);
setContext('tileDimensions', tileDimensions);
setContext('coords', coords);
setContext('scale', scale);
setContext('margin', margin);
setContext('rotate', rotate);
setContext('mapToScene', mapToScene);
setContext('mapX', mapX);
setContext('mapY', mapY);
setContext('placeX', placeX);
setContext('placeY', placeY);
setContext('placeXY', placeXY);


const left = placeXY(0, 0);
const top = placeXY(0, tileDimensions);
const right = placeXY(tileDimensions, tileDimensions);
const bottom = placeXY(tileDimensions, 0);

</script>

<style>
div {
    display: grid;
    align-items: center;
    justify-items: center;
}
svg {
	position: fixed;
	top:0;
}

</style>

<div>
	<svg
		in:fly={{ duration: 200, y: 10 }}
		width={width} height={width / 2 + margin * 2}>
		<defs>
			<clipPath id="shadow-clip">
				<polygon 
					points={[left, bottom, right, top].map((v) => v.join(',')).join(' ')} 
				/>
			</clipPath>
		</defs>
		<slot name='defs'>
			<defs>
				<radialGradient id="treetop" cx="20%" cy="20%" r="50%" fx="20%" fy="20%">
						<stop offset="10%" stop-color="#3a1e48" />
						<stop offset="95%" stop-color="#2e183a" />
				</radialGradient>
			</defs>
		</slot>

		<slot name='earth'></slot>
		{#if grid}
			<g in:fly={{ duration: 200, y: -2, easing }}>
				{#each Array.from({ length: tileDimensions + 1 }).fill(null) as _,i }
					<line 
						x1={coords(i, 0).lx}
						x2={coords(i, tileDimensions).lx}
						y1={coords(i, 0).ly}
						y2={coords(i, tileDimensions).ry}
						stroke=gray
					/>
					<line 
						x1={coords(0, i).lx}
						x2={coords(tileDimensions, i).lx}
						y1={coords(0, i).ly}
						y2={coords(tileDimensions, i).ry}
						stroke=gray
					/>
				{/each}
			</g>
		{/if}
		<slot 
			mapX={mapX} 
			mapY={mapY} 
			mapToScene={mapToScene}
			placeX={placeX}
			placeY={placeY}
			></slot>
	</svg>
</div>