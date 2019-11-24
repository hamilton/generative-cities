<script>
import { setContext } from 'svelte';
import { scaleLinear } from 'd3-scale';
export let width = 500;
export let height = 500;
export let tileSize = 25;

let tileDimensions = width / tileSize / 2;	

setContext('tileSize', tileSize);
setContext('width', width);
setContext('height', height);
setContext('tileDimensions', tileDimensions)
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
		x1={i * tileSize}
		x2={width/2 + i * tileSize}
		y1={height/2 + (i / 2) * tileSize}
		y2={(.5) * (height / 2) + (i / 2) * tileSize}
		stroke=gray
	/>
		<line
			x1={i * tileSize}
			x2={width/2 + i * tileSize}
			y1={height/2 - (i / 2) * tileSize}
			y2={height/2 + ((tileDimensions-i) / 2) * tileSize}
			stroke=gray
		/>
	{/each}
	<slot></slot>
</svg>