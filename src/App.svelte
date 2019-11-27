<script>
import City from './scenes/City.svelte';
import Heights from './scenes/Heights.svelte';

let which = 1;
const scenes = [
	{name: 'Hamlet', component: City},
	{name: 'Heights', component: Heights},
];

</script>

<style>

h1 {
	margin: 0;
	margin-bottom: var(--space-2x);
	font-family: 'Seraphs Var';
	font-variation-settings: 'wght' 100, 'SRFS' 6;
}

h1 sub {
	color: tomato;
	font-size:.6em;
	font-variation-settings: 'wght' 200, 'SRFS' 6;
}

.scene-controls {
	position: fixed;
	right:0;
	top:0;
	color: white;
	padding: var(--space-2x);
	width: max-content;
}

.scene-controls label {
	width: var(--space-16x);
}
</style>

{#each scenes as {name, component}, i}
	{#if i === which}
		<svelte:component this={scenes[which].component} />
	{/if}
{/each}


<div class='scene-controls'>
	<h1>isomap<sub>α</sub></h1>
	{#each scenes as {name, component}, i}
	<label>
		<input type=radio bind:group={which} value={i}>
		{name}
	</label>
	{/each}
</div>