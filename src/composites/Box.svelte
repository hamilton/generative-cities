<script>
import { getContext } from 'svelte';
import Polygon from '../primitives/Polygon.svelte';

export let placeX = getContext('placeX');
export let placeY = getContext('placeY');
export let placeXY = getContext('placeXY');
export let mapToScene = getContext('mapToScene');
export let tileDimensions = getContext('tileDimensions');
export let downwardShadow = false;
export let castingShadow = true;

export let x = 0;
export let y = 0;
export let z = 0;
export let height = 1;
export let xLength = 1;
export let yLength = 1;
export let angle = 0;
export let opacity = 1;

let centroid = [];
$: centroid = [xLength / 2, yLength / 2];

let shadow = [];

let rx;
let ry;
let tx;
let ty;
let bx;
let by;
let H;
$: [rx, ry] = mapToScene(xLength, yLength, 0, angle, centroid);
$: [bx, by] = mapToScene(xLength, 0, 0, angle, centroid);
$: [tx, ty] = mapToScene(0, yLength, 0, angle, centroid);
$: [_x, _y] = placeXY(x, y);
$: H = height * tileDimensions;

$: shadow = [
  [bx, by],
  [bx + H, by + H / 2],
  [rx + H, ry + H / 2],
  [rx, ry],
  [rx + H, ry + H / 2],
  [tx + H, ty + H / 2],
  [tx, ty],
];

</script>

{#if castingShadow}
<g clip-path="url(#shadow-clip)">
    <g transform="translate({placeX(x, y)} {placeY(x, y)})">
        <polygon 
            points={shadow.map((v) => v.join(',')).join(' ')}
            fill="url(#shadow)" 
        />
    </g>
</g>
{/if}

{#if downwardShadow}
<g transform="translate({placeX(x, y)} {placeY(x, y)})">
    <Polygon 
        points={[
            [0, 0, 0],
            [xLength, 0, 0],
            [xLength, yLength, 0],
            [0, yLength, 0],
        ]}
        centroid={centroid}
        fill="url(#shadow)"
        angle={angle}
    />
</g>
{/if}

<g transform="translate({placeX(x, y, z)} {placeY(x, y, z)})" opacity={opacity}>



    <Polygon 
        points={[
            [xLength, yLength, 0],
            [xLength, yLength, height],
            [0, yLength, height],
            [0, yLength, 0],
        ]}
        centroid={centroid}
        angle={angle}
        fill="url(#right-back)"
    />

    <Polygon 
        points={[
            [0, 0, 0],
            [0, 0, height],
            [xLength, 0, height],
            [xLength, 0, 0],
        ]}
        centroid={centroid}
        angle={angle}
        fill="url(#left-front)"
    />

    <!-- <Polygon 
        points={[
            [b, b, 0],
            [b, b, z],
            [1-b, b, z],
            [1-b, b, 0]
        ]}
        angle={angle}
        fill="url(#left-front)"
    />  -->

    <Polygon 
        points={[
            [xLength, 0, 0],
            [xLength, 0, height],
            [xLength, yLength, height],
            [xLength, yLength, 0],
        ]}
        centroid={centroid}
        fill="url(#right-front)"
        angle={angle}
    />

    <Polygon 
        points={[
            [0, 0, height],
            [xLength, 0, height],
            [xLength, yLength, height],
            [0, yLength, height],
        ]}
        centroid={centroid}
        fill="url(#top)"
        angle={angle}
    />
</g>