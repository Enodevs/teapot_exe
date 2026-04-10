<script lang="ts">
	type Line = { id: number; kind: 'cmd' | 'out' | 'err' | 'hdr'; text: string };

	let nextLineId = 0;
	function makeLine(kind: Line['kind'], text: string): Line {
		nextLineId += 1;
		return { id: nextLineId, kind, text };
	}

	let lines = $state<Line[]>([
		makeLine('out', 'BrewOps HTCPCP Console v0.418.0 — type HELP or try BREW COFFEE.'),
		makeLine('hdr', 'Connected to /api/brew (expect disappointment)')
	]);

	let input = $state('');
	let busy = $state(false);

	let { onBrewRefusal }: { onBrewRefusal?: () => void } = $props();

	/** One hue (emerald); brightness steps only — no rainbow */
	function lineColorClass(kind: Line['kind']): string {
		switch (kind) {
			case 'cmd':
				return 'text-emerald-100';
			case 'out':
				return 'text-emerald-200/90';
			case 'err':
				return 'text-emerald-50 font-semibold';
			case 'hdr':
				return 'text-emerald-400/75';
		}
	}

	function push(kind: Line['kind'], text: string) {
		lines = [...lines, makeLine(kind, text)];
	}

	async function runCommand(raw: string) {
		const cmd = raw.trim();
		if (!cmd) return;
		push('cmd', `> ${cmd}`);
		input = '';

		if (cmd.toLowerCase() === 'help') {
			push('out', 'Commands: BREW COFFEE | STATUS | CLEAR | RFC2324 (all roads lead to 418)');
			return;
		}
		if (cmd.toLowerCase() === 'clear') {
			lines = [];
			return;
		}
		if (cmd.toLowerCase() === 'rfc2324') {
			push(
				'out',
				'Hyper Text Coffee Pot Control Protocol — the standard that keeps us honest.'
			);
			return;
		}
		if (cmd.toLowerCase() === 'status') {
			push('out', 'Teapot status: smug. Coffee pipeline: nonexistent.');
			return;
		}

		busy = true;
		try {
			const res = await fetch('/api/brew', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					beverage: 'coffee',
					grind: 'existential dread',
					region: 'Silicon Valley (unfortunately)',
					okrs: ['refuse', 'comply', 'look expensive']
				})
			});

			const teapotType = res.headers.get('X-Teapot-Type');
			const refusal = res.headers.get('X-Refusal-Reason');

			push('err', `← HTTP ${res.status} ${res.statusText || "I'm a teapot"}`);
			if (teapotType) push('hdr', `X-Teapot-Type: ${teapotType}`);
			if (refusal) push('hdr', `X-Refusal-Reason: ${refusal}`);

			let bodyText = '';
			try {
				const data = await res.json();
				bodyText = typeof data?.message === 'string' ? data.message : JSON.stringify(data, null, 2);
			} catch {
				bodyText = await res.text();
			}
			push('out', bodyText);

			if (res.status === 418) onBrewRefusal?.();
		} catch (e) {
			push('err', `Network chaos: ${e instanceof Error ? e.message : String(e)}`);
		} finally {
			busy = false;
		}
	}

	function onsubmit(e: Event) {
		e.preventDefault();
		void runCommand(input);
	}
</script>

<div
	class="overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#070b0a] shadow-[0_0_0_1px_oklch(0.35_0.08_160/0.15),0_24px_80px_oklch(0_0_0/0.45)]"
	role="region"
	aria-label="HTCPCP developer console"
>
	<div
		class="flex items-center justify-between border-b border-white/[0.06] bg-emerald-950/40 px-4 py-3.5"
	>
		<div class="flex items-center gap-2">
			<span class="size-2.5 rounded-full bg-white/15"></span>
			<span class="size-2.5 rounded-full bg-white/22"></span>
			<span class="size-2.5 rounded-full bg-white/15"></span>
		</div>
		<span class="font-mono text-sm text-emerald-200/70">brewops-console — zsh — 80×24</span>
		<span class="font-mono text-xs text-emerald-300/60">418-ready</span>
	</div>

	<div
		class="font-mono max-h-[min(52vh,480px)] min-h-[240px] overflow-y-auto p-5 text-base leading-relaxed text-emerald-50/95"
	>
		{#each lines as line (line.id)}
			<div class="mb-2 whitespace-pre-wrap break-words {lineColorClass(line.kind)}">
				{line.text}
			</div>
		{/each}
		{#if busy}
			<div class="text-emerald-200/65 text-base animate-pulse">…brewing political fallout</div>
		{/if}
	</div>

	<form onsubmit={onsubmit} class="border-t border-white/[0.06] p-4 flex gap-3 bg-black/30">
		<span class="font-mono text-emerald-300/80 pt-2.5 text-lg select-none">$</span>
		<input
			bind:value={input}
			disabled={busy}
			placeholder="Try: BREW COFFEE"
			class="font-mono flex-1 bg-transparent text-lg text-emerald-50 placeholder:text-emerald-700/80 outline-none disabled:opacity-50"
			autocomplete="off"
			spellcheck="false"
			aria-label="Console command"
		/>
		<button
			type="submit"
			disabled={busy}
			class="rounded-lg bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-emerald-400/25 hover:bg-emerald-500/25 disabled:opacity-50"
		>
			Run
		</button>
	</form>
</div>
