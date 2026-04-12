<script lang="ts">
	let { entries }: { entries: string[] } = $props();
</script>

<div
	class="rounded-2xl border border-white/[0.08] bg-black/30 p-5 backdrop-blur-sm sm:p-6"
	role="region"
	aria-label="Brew incident log"
>
	<h3 class="text-lg font-semibold text-white sm:text-xl">Brew history <span class="text-white/45">(incidents)</span></h3>
	<p class="mt-1 text-sm text-white/50">Real-time shame archive. Immutable. Like your standup notes.</p>
	<ul
		class="mt-4 max-h-64 space-y-2 overflow-y-auto font-mono text-sm leading-snug text-emerald-200/85 sm:max-h-80 sm:text-base"
	>
		{#if entries.length === 0}
			<li class="text-white/40">No incidents yet. The teapot is watching. Waiting.</li>
		{:else}
			{#each entries as line, i (`${i}-${line.slice(0, 24)}`)}
				<li class="border-l-2 border-emerald-500/30 pl-3 text-white/80">{line}</li>
			{/each}
		{/if}
	</ul>
</div>
