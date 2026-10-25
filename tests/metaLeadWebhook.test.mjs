import assert from 'node:assert/strict';
import test from 'node:test';
import { buildMetaLeadWebhookPayload } from '../src/utils/metaLeadWebhook.ts';

const lead = {
	firstName: 'Marie',
	lastName: 'Dupont',
	email: 'marie@example.fr',
	phone: '+33612345678',
	profileKey: 'equilibre',
	eventId: 'evt-123',
	now: 1_761_400_000_123,
};

const request = (headers) => new Request('https://cecilecoaching.fr/api/reflow-lead', { method: 'POST', headers });

test('buildMetaLeadWebhookPayload transmet le lead et les signaux Meta', () => {
	const payload = buildMetaLeadWebhookPayload(
		request({
			Referer: 'https://cecilecoaching.fr/outils/auto-evaluation-re-flow/?utm_source=fb',
			Cookie: 'theme=dark; _fbp=fb.1.111.222; _fbc=fb.1.333.abc',
			'CF-Connecting-IP': '203.0.113.7',
			'User-Agent': 'Mozilla/5.0 Test',
		}),
		lead,
	);
	assert.deepEqual(payload, {
		event_name: 'Lead',
		event_id: 'evt-123',
		event_time: 1_761_400_000,
		action_source: 'website',
		event_source_url: 'https://cecilecoaching.fr/outils/auto-evaluation-re-flow/',
		content_name: 'quiz_reflow',
		content_category: 'quiz',
		first_name: 'Marie',
		last_name: 'Dupont',
		email: 'marie@example.fr',
		phone: '+33612345678',
		quiz_profile: 'equilibre',
		client_ip_address: '203.0.113.7',
		client_user_agent: 'Mozilla/5.0 Test',
		fbp: 'fb.1.111.222',
		fbc: 'fb.1.333.abc',
	});
});

test('buildMetaLeadWebhookPayload reconstruit fbc depuis le fbclid sans cookie', () => {
	const payload = buildMetaLeadWebhookPayload(
		request({ Referer: 'https://cecilecoaching.fr/outils/auto-evaluation-re-flow/?fbclid=XYZ' }),
		lead,
	);
	assert.equal(payload.fbc, `fb.1.${lead.now}.XYZ`);
	assert.equal(payload.fbp, '');
});

test('buildMetaLeadWebhookPayload reste valide sans en-têtes', () => {
	const payload = buildMetaLeadWebhookPayload(request({}), lead);
	assert.equal(payload.event_source_url, '');
	assert.equal(payload.fbc, '');
	assert.equal(payload.client_ip_address, '');
});
