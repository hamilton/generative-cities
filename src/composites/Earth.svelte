<script>
import { getContext } from 'svelte';
import Polygon from '../primitives/Polygon.svelte';
// let's opt to always provide the building palette for now.
import BuildingPalette01 from '../palettes/BuildingPalette01.svelte';

export let tileDimensions = getContext('tileDimensions');
export let margin = getContext('margin');
export let width = getContext('width');
export let horizontalAngle = 0;
</script>

<g>
    
    <defs>
        <BuildingPalette01 />
        <linearGradient id="earth" x1="0" x2="1" y1="0" y2="1">
            <stop class="stop1" offset="0%" stop-color=#705f7e />
            <stop class="stop3" offset="20%" stop-color=#5a5e84 />
            <stop class="stop1" offset="40%" stop-color=#705f7e />
            <stop class="stop3" offset="60%" stop-color=#5a5e84 />
        </linearGradient>
    </defs>


    <!-- <polygon points={toString(left, top, right, bottom)} fill=url(#earth) opacity=.4  /> -->

    <g transform="translate(0 {margin + width / 4})">
        <Polygon 
            points={[
                [tileDimensions, 0, -1],
                [tileDimensions, 0, 0],
                [tileDimensions, tileDimensions, 0],
                [tileDimensions, tileDimensions, -1],
            ]}
            centroid={[tileDimensions / 2, tileDimensions / 2]}
            angle={horizontalAngle}
            fill=url(#left-front) 
            opacity={0.1}
        />
    </g>
    <g transform="translate(0 {margin + width / 4})">
        <Polygon 
            points={[
                [0, 0, -1],
                [tileDimensions, 0, -1],
                [tileDimensions, 0, 0],
                [0, 0, 0],
            ]}
            centroid={[tileDimensions / 2, tileDimensions / 2]}
            angle={horizontalAngle}
            fill=url(#left-front) 
            opacity={0.3}
        />
    </g>

    <g transform="translate(0 {margin + width / 4})">
        <Polygon 
            points={[
                [0, 0, 0],
                [0, tileDimensions, 0],
                [tileDimensions, tileDimensions, 0],
                [tileDimensions, 0, 0],
            ]}
            angle={horizontalAngle}
            centroid={[tileDimensions / 2, tileDimensions / 2]}
            fill=url(#earth)
            opacity=.4
        />
    </g>
</g>