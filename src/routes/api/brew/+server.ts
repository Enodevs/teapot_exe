import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const REFUSALS = [
	"Nice try, middle manager. I'm a teapot, not a venture-backed espresso machine.",
	"BREW denied. Have you tried water? It's hydrating and statistically less entitled.",
	"Your OKR was 'ship coffee.' Mine is 'stay ceramic.' We are not aligned.",
	"HTCPCP/1.0 says no. Also your standing desk can't fix this.",
	"I would brew coffee, but then I'd be a liar and ineligible for SOC 2 Teapot.",
	"418: The teapot has logged this incident under 'culture fit.'",
	"Larry Masinter didn't write RFC 2324 for you to ignore it with a Keurig mindset."
] as const;

const TEAPOT_HEADERS = {
	'X-Teapot-Type': 'short-and-stout',
	'X-Refusal-Reason': 'I am a teapot',
	'X-HTCPCP-Version': '1.0',
	'X-BrewOps-Incident': 'TEAPOT-418-ENTERPRISE',
	'X-Compliance': 'ISO-418-CERTIFIED',
	'Cache-Control': 'no-store, no-brew'
} as const;

function pickRefusal(): string {
	return REFUSALS[Math.floor(Math.random() * REFUSALS.length)]!;
}

function brewBody(method: string, message: string) {
	return {
		protocol: 'HTCPCP/1.0',
		status: 418,
		title: "I'm a teapot",
		message,
		rfc: 'RFC 2324 — Hyper Text Coffee Pot Control Protocol',
		honor: 'With respect to Larry Masinter',
		method_observed: method,
		suggestion: 'Use an actual coffee pot. This endpoint is teapot-native only.'
	};
}

export const GET: RequestHandler = async () => {
	return json(brewBody('GET', pickRefusal()), { status: 418, headers: { ...TEAPOT_HEADERS } });
};

export const POST: RequestHandler = async ({ request }) => {
	let payload: unknown = null;
	try {
		payload = await request.json();
	} catch {
		// still 418 — we read the attempt, we simply decline with style
	}

	const beverage =
		payload && typeof payload === 'object' && payload !== null && 'beverage' in payload
			? String((payload as { beverage?: unknown }).beverage ?? '')
			: '';

	const extra =
		beverage && beverage.toLowerCase().includes('coffee')
			? ' Coffee keyword detected. Automatic escalation to Teapot Legal™.'
			: '';

	return json(
		{
			...brewBody('POST', pickRefusal() + extra),
			received: payload
		},
		{ status: 418, headers: { ...TEAPOT_HEADERS } }
	);
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 204,
		headers: { Allow: 'GET, POST, OPTIONS' }
	});
};
