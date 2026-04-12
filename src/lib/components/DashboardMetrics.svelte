<script lang="ts">
	let {
		refusedCount,
		rageLabel,
		existentialDread,
		larryRolls
	}: {
		refusedCount: number;
		rageLabel: string;
		existentialDread: number;
		larryRolls: number;
	} = $props();

	const refusedFmt = $derived(refusedCount.toLocaleString('en-US'));
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-md"
		style="animation-delay: 0ms"
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 animate-shimmer"
		></div>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">Coffee requests refused</p>
		<p class="mt-2 font-mono text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">{refusedFmt}</p>
		<p class="mt-1 text-sm text-emerald-300/70">↑ accelerating (you did this)</p>
	</div>

	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-950/20 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-md"
		style="animation-delay: 60ms"
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 animate-shimmer"
		></div>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">Teapot rage level</p>
		<p class="mt-2 font-mono text-xl font-bold tracking-tight text-red-300 sm:text-2xl">{rageLabel}</p>
		<p class="mt-1 text-sm text-red-200/50">P99 latency: emotional damage</p>
	</div>

	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-5 backdrop-blur-md"
		style="animation-delay: 120ms"
	>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">Existential dread</p>
		<p class="mt-2 font-mono text-2xl font-semibold text-amber-200/90 sm:text-3xl">{existentialDread}%</p>
		<p class="mt-1 text-sm text-white/40">SRE-approved angst</p>
	</div>

	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-5 backdrop-blur-md"
		style="animation-delay: 180ms"
	>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">Larry rolled in grave</p>
		<p class="mt-2 font-mono text-2xl font-semibold text-white/90 sm:text-3xl">{larryRolls}</p>
		<p class="mt-1 text-sm text-white/40">RPM (rolls per minute)</p>
	</div>

	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-void-900/60 p-5 backdrop-blur-md"
		style="animation-delay: 240ms"
	>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">HTCPCP compliance</p>
		<p class="mt-2 font-mono text-2xl font-semibold text-emerald-200/90 sm:text-3xl">100%</p>
		<p class="mt-1 text-sm text-white/40">Certified petty</p>
	</div>

	<div
		class="metric-enter group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-5 backdrop-blur-md"
		style="animation-delay: 300ms"
	>
		<p class="text-sm font-medium uppercase tracking-wider text-white/55">Coffee shipped</p>
		<p
			class="mt-2 font-mono text-2xl font-semibold text-white/35 line-through decoration-white/20 sm:text-3xl"
		>
			0
		</p>
		<p class="mt-1 text-sm text-white/40">On track for nothing</p>
	</div>
</div>
