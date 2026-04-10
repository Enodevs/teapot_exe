<script lang="ts">
	const metrics = [
		{
			label: 'Coffee requests refused',
			value: '420,069',
			delta: '+12.4% WoW',
			tone: 'text-white/95'
		},
		{
			label: 'Teapot rage level',
			value: 'CRITICAL',
			delta: 'P99 latency: emotional',
			/* single warm accent in the whole grid */
			tone: 'text-red-300/95'
		},
		{
			label: 'HTCPCP compliance',
			value: '100%',
			delta: 'Larry-approved',
			tone: 'text-white/90'
		},
		{
			label: 'Coffee shipped',
			value: '0',
			delta: 'On track',
			tone: 'text-white/40 line-through decoration-white/20'
		}
	] as const;
</script>

<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
	{#each metrics as m, i (m.label)}
		<div
			class="metric-enter group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-6 shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-md"
			style="animation-delay: {i * 70}ms"
		>
			<div
				class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 animate-shimmer"
			></div>
			<p class="text-sm font-medium uppercase tracking-wider text-white/55">{m.label}</p>
			<p class="mt-3 font-mono text-3xl font-semibold tracking-tight sm:text-4xl {m.tone}">{m.value}</p>
			<p class="mt-2 text-sm text-white/45">{m.delta}</p>
		</div>
	{/each}
</div>
