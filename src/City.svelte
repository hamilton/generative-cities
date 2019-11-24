<script>
import { writable, derived } from 'svelte/store';
import { setContext } from 'svelte';
import { scaleLinear } from 'd3-scale';
export let width = 500;
export let height = 500;
export let tileSize = 25;
export let margin = 50;

let tileDimensions = width / tileSize / 2;	

let H = height / 2 / tileDimensions;
let W = width / 2 / tileDimensions;

const coords = (cx, cy) => {
	return {
		lx: cx * W + cy * W,
		ly: height / 2 + cx * (H / 2) - cy * (H / 2),
		tx: cx * W + cy * W + W,
		ty: height / 2 + cx * (H / 2) - cy * (H / 2) - H / 2,
		rx: cx * W + cy * W + W * 2,
		ry: height / 2 + cx * (H / 2) - cy * (H / 2),
		bx: cx * W + cy * W + W,
		by: height / 2 + cx * (H / 2) - cy * (H / 2) - H / 2 + H
	}
}

setContext('tileSize', tileSize);
setContext('width', width);
setContext('height', height);
setContext('tileDimensions', tileDimensions);
setContext('coords', coords);
// how to draw these lines?	

</script>

<style>

</style>

<svg width={width} height={height}>
	<defs>
		<linearGradient id="top" x1="0" x2="1" y1="0" y2="1">
		<stop class="stop1" offset="0%" stop-color=#c25e5e />
		<stop class="stop3" offset="100%" stop-color=#60547d />
		</linearGradient>
		<linearGradient id="right" x1="0" x2="1" y1="0" y2="1">
			<stop class="stop1" offset="0%" stop-color=#875580 />
			<stop class="stop3" offset="100%" stop-color=#2f4858 />
			</linearGradient>
			<linearGradient id="left" x1="0" x2="0" y1="0" y2="1">
			<stop class="stop1" offset="0%" stop-color=#d65db1 />
			<stop class="stop1" offset="30%" stop-color=#d65db1 />
			<stop class="stop3" offset="100%" stop-color=#60547d />
			</linearGradient>
	</defs>
	{#each Array.from({length:tileDimensions+1}).fill(null) as _,i }
		<line 
			x1={coords(i,0).lx}
			x2={coords(i, tileDimensions).lx}
			y1={coords(i, 0).ly}
			y2={coords(i, tileDimensions).ry}
			stroke=gray
		/>
		<line 
			x1={coords(0,i).lx}
			x2={coords(tileDimensions, i).lx}
			y1={coords(0, i).ly}
			y2={coords(tileDimensions, i).ry}
			stroke=gray
		/>
	{/each}
	<slot></slot>
</svg>