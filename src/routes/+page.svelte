<script lang="ts">
	import AnimatedTeapot from '$lib/components/AnimatedTeapot.svelte';
	import DashboardMetrics from '$lib/components/DashboardMetrics.svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	let teapotRaging = $state(false);
	let heroBusy = $state(false);
	let heroMessage = $state<string | null>(null);

	const tickerItems = [
		'ISO 418 CERTIFIED',
		'Larry Masinter hive mind: online',
		'Coffee SLA: permanently breached',
		'HTCPCP/1.0 — refuse with confidence',
		'SOC 2 Type Teapot',
		'Zero coffee delivered · infinite compliance',
		'RFC 2324 or nothing',
		'Your standup is not a brew endpoint'
	] as const;

	async function brewCoffee() {
		heroBusy = true;
		heroMessage = null;
		teapotRaging = true;
		try {
			const res = await fetch('/api/brew', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					beverage: 'coffee',
					urgency: 'CEO is asking',
					budget: 'unlimited (lol)'
				})
			});
			let msg = '';
			try {
				const data = (await res.json()) as { message?: string };
				msg = typeof data?.message === 'string' ? data.message : '';
			} catch {
				msg = await res.text();
			}
			heroMessage = res.status === 418 ? msg : `Unexpected ${res.status}: ${msg}`;
		} catch (e) {
			heroMessage = e instanceof Error ? e.message : 'The void declined to comment.';
		} finally {
			heroBusy = false;
		}
	}
</script>

<svelte:head>
	<title>TEAPOT.EXE — I'm a Teapot as a Service</title>
	<meta
		name="description"
		content="Enterprise-grade teapot infrastructure. Real HTTP 418. Zero coffee. RFC 2324 compliant satire."
	/>
</svelte:head>

<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 sm:pt-14">
	<!-- Ambient orbs — neutral, low chroma -->
	<div
		class="pointer-events-none fixed -right-32 top-1/4 h-96 w-96 rounded-full bg-void-700/25 blur-[100px]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none fixed -left-24 bottom-1/4 h-80 w-80 rounded-full bg-void-800/20 blur-[90px]"
		aria-hidden="true"
	></div>

	<header class="flex flex-col gap-8 border-b border-white/[0.07] pb-12 lg:flex-row lg:items-center lg:justify-between">
		<div>
			<p class="font-mono text-sm font-medium uppercase tracking-[0.18em] text-white/55">
				BrewOps · Teapot Cloud
			</p>
			<h1 class="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
				TEAPOT<span class="text-white/70">.EXE</span>
			</h1>
			<p class="mt-4 max-w-xl text-xl leading-relaxed text-white/80 sm:text-2xl sm:leading-snug">
				Zero Coffee Delivered. <span class="text-white font-medium">100% Compliance.</span>
				The only dashboard that ships a real
				<span class="font-mono text-white/95">418 I'm a teapot</span> to your Network tab.
			</p>
			<div class="mt-6 flex flex-wrap gap-2">
				<span class="rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/65"
					>ISO 418</span
				>
				<span class="rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/65"
					>SOC 2 · Teapot</span
				>
				<span class="rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/65"
					>HTCPCP Ready</span
				>
			</div>
		</div>
		<div class="flex shrink-0 justify-center lg:justify-end">
			<AnimatedTeapot bind:raging={teapotRaging} />
		</div>
	</header>

	<!-- Ticker -->
	<div
		class="border-b border-white/[0.06] bg-black/25 py-3 overflow-hidden font-mono text-sm uppercase tracking-[0.2em] text-white/50"
		aria-hidden="true"
	>
		<div class="animate-ticker flex w-max gap-10 whitespace-nowrap">
			{#each [...tickerItems, ...tickerItems] as item, i (`${item}-${i}`)}
				<span>{item}</span>
			{/each}
		</div>
	</div>

	<section class="py-16">
		<DashboardMetrics />
	</section>

	<!-- Hero CTA -->
	<section
		class="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-void-900/50 p-8 shadow-[0_0_0_1px_oklch(1_0_0/0.03)_inset] sm:p-14"
	>
		<div
			class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,oklch(0.28_0.02_265/0.35),transparent_55%)]"
		></div>
		<div class="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
			<div>
				<h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					Production-grade refusal pipeline
				</h2>
				<p class="mt-4 max-w-lg text-lg leading-relaxed text-white/70">
					One click. Real status code. Headers so honest they hurt. Built for teams who confuse velocity
					with caffeine.
				</p>
				<button
					type="button"
					onclick={brewCoffee}
					disabled={heroBusy}
					class="group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.14] bg-white/[0.08] px-10 py-5 text-base font-semibold uppercase tracking-[0.1em] text-white shadow-none ring-0 transition hover:border-white/[0.2] hover:bg-white/[0.11] active:scale-[0.98] disabled:opacity-50"
				>
					{#if heroBusy}
						<span class="size-5 animate-spin rounded-full border-2 border-white/25 border-t-white/80"></span>
					{/if}
					Brew coffee
					<span
						class="text-sm font-normal normal-case tracking-normal text-white/50 group-hover:text-white/60"
						>(legally impossible)</span
					>
				</button>
				{#if heroMessage}
					<p
						class="font-mono mt-6 max-w-lg rounded-xl border border-white/[0.1] bg-black/40 px-5 py-4 text-base leading-relaxed text-white/85"
						role="status"
					>
						{heroMessage}
					</p>
				{/if}
			</div>
			<Terminal onBrewRefusal={() => (teapotRaging = true)} />
		</div>
	</section>

	<!-- Enterprise theater -->
	<section class="mt-20 grid gap-10 lg:grid-cols-2">
		<div
			class="rounded-2xl border border-white/[0.07] bg-void-900/40 p-8 backdrop-blur-md sm:p-10"
		>
			<h3 class="text-xl font-semibold text-white sm:text-2xl">Brew request form</h3>
			<p class="mt-2 text-base text-white/55">All fields optional. Outcome non-negotiable.</p>
			<form
				class="mt-8 space-y-5"
				onsubmit={(e) => {
					e.preventDefault();
					void brewCoffee();
				}}
			>
				<div>
					<label for="bev" class="text-sm font-medium uppercase tracking-wider text-white/60"
						>Beverage</label
					>
					<input
						id="bev"
						class="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-4 text-base text-white/95 outline-none ring-white/20 focus:ring-2"
						value="Coffee (how dare you)"
						readonly
					/>
				</div>
				<div>
					<label for="stake" class="text-sm font-medium uppercase tracking-wider text-white/60"
						>Executive sponsor</label
					>
					<input
						id="stake"
						class="mt-2 w-full rounded-xl border border-white/[0.1] bg-black/40 px-4 py-4 text-base text-white/95 outline-none ring-white/20 focus:ring-2"
						placeholder="e.g. Larry (legend)"
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-xl border border-white/[0.12] bg-white/[0.07] py-4 text-base font-semibold text-white hover:border-white/[0.18] hover:bg-white/[0.1]"
				>
					Submit to teapot (418)
				</button>
			</form>
		</div>

		<div class="space-y-6">
			<div
				class="rounded-2xl border border-white/[0.07] bg-void-900/40 p-8 backdrop-blur-md sm:p-10"
			>
				<h3 class="text-xl font-semibold text-white sm:text-2xl">Wall of fake credibility</h3>
				<blockquote
					class="mt-5 border-l-2 border-white/20 pl-5 text-lg italic leading-relaxed text-white/80"
				>
					“We did not authorize this roadmap. Love, the universe.”
					<cite class="mt-3 block font-mono text-sm not-italic text-white/50"
						>— Larry Masinter, definitely maybe, RFC 2324 energy</cite
					>
				</blockquote>
			</div>
			<div
				class="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-void-900/80 to-black/60 p-8 sm:p-10"
			>
				<h3 class="text-base font-semibold uppercase tracking-wider text-white/55">Pricing</h3>
				<ul class="mt-5 space-y-4 text-lg">
					<li class="flex justify-between text-white/85">
						<span>Starter</span>
						<span class="font-mono text-white/90">$418/mo</span>
					</li>
					<li class="flex justify-between text-white/85">
						<span>Enterprise</span>
						<span class="font-mono text-white/90">Call legal</span>
					</li>
					<li class="flex justify-between text-white/85">
						<span>Coffee</span>
						<span class="font-mono text-white/45 line-through decoration-white/25">Not a thing</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<footer class="mt-24 border-t border-white/[0.06] pt-12 text-center text-sm text-white/50">
		<p class="font-mono">
			HTCPCP/1.0 · RFC 2324 · HTTP 418 — TEAPOT.EXE is satire with real status codes.
		</p>
	</footer>
</div>
