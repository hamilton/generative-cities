<script>
import City from './scenes/City.svelte';

let which = 0;
const scenes = [
	{name: 'City', component: City},
	{name: 'City', component: City},
	{name: 'City', component: City},
];

</script>

<style>
.scene-controls {
	position: fixed;
	right:0;
	top:0;
	color: white;
	padding: var(--space-2x);
}

.scene-controls label {
	width: var(--space-16x);
}
</style>

<div class='scene-controls'>
	{#each scenes as {name, component}, i}
	<label>
		<input type=radio bind:group={which} value={i}>
		{name}
	</label>
	{/each}
</div>
{#each scenes as {name, component}, i}
	{#if i === which}
		<svelte:component this={scenes[which].component} />
	{/if}
{/each}