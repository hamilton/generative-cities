<script>
import { writable, derived } from 'svelte/store';
import { setContext } from 'svelte';
import { scaleLinear } from 'd3-scale';
import { fly } from 'svelte/transition';
import { cubicOut as easing } from 'svelte/easing';
export let width = 500;
export let tileSize = 25;
export let margin = 50;
export let grid = true;

let tileDimensions = width / tileSize / 2;	

let H = width / 2 / tileDimensions;
let W = width / 2 / tileDimensions;

const coords = (cx, cy) => {
	return {
		lx: cx * W + cy * W,
		ly: margin + width / 4 + cx * (H / 2) - cy * (H / 2),
		tx: cx * W + cy * W + W,
		ty: margin + width / 4 + cx * (H / 2) - cy * (H / 2) - H / 2,
		rx: cx * W + cy * W + W * 2,
		ry: margin + width / 4 + cx * (H / 2) - cy * (H / 2),
		bx: cx * W + cy * W + W,
		by: margin + width / 4 + cx * (H / 2) - cy * (H / 2) - H / 2 + H
	}
}

const scale = (cx, cy) => {
	return [cx * W + cy * W, margin + width / 4 + cx * (H / 2) - cy * (H / 2)]
}

setContext('tileSize', tileSize);
setContext('width', width);
setContext('height', width / 2);
setContext('tileDimensions', tileDimensions);
setContext('coords', coords);
setContext('scale', scale);
setContext('margin', margin);
// how to draw these lines?	

</script>

<style>

</style>

<svg width={width} height={width / 2 + margin * 2}>
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
		<linearGradient id="shadow" x1="0" x2="1" y1="0" y2="1">
				<stop class="stop1" offset="0%" stop-color=rgba(0,0,0,.2) />
				<stop class="stop3" offset="50%" stop-color=rgba(0,0,0,.025) />
				<stop class="stop3" offset="70%" stop-color=rgba(0,0,0,.01) />
				<stop class="stop3" offset="100%" stop-color=rgba(0,0,0,0) />
		</linearGradient>
		<radialGradient id="treetop" cx="20%" cy="20%" r="50%" fx="20%" fy="20%">
				<stop offset="10%" stop-color="#3a1e48" />
				<stop offset="95%" stop-color="#2e183a" />
		</radialGradient>
	</defs>
	<slot name='earth'></slot>
	{#if grid}
		<g transition:fly={{duration: 200, y: -2, easing}}>
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
		</g>
	{/if}
	<slot></slot>
</svg>