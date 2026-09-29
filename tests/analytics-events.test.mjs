import assert from 'node:assert/strict';
import test from 'node:test';
import {
	ANALYTICS_EVENTS,
	offerCtaEvent,
	quizCtaEvent,
	quizQuestionAnsweredEvent,
	tunnelCtaEvent,
	whatsappCtaEvent,
} from '../src/config/analyticsEvents.ts';

test('les noms historiques courts restent stables', () => {
	assert.equal(tunnelCtaEvent('header-mobile'), 'tunnel_cta_header-mobile');
	assert.equal(whatsappCtaEvent('header'), 'whatsapp_cta_header');
	assert.equal(quizQuestionAnsweredEvent(5), 'quiz_question_05_answered');
	assert.equal(ANALYTICS_EVENTS.bookingViewed, 'booking_viewed');
	assert.equal(ANALYTICS_EVENTS.bookingConfirmed, 'booking_confirmed');
});

test('les campagnes sont normalisées avant envoi à Umami', () => {
	assert.equal(quizCtaEvent(' Article Coach APA '), 'quiz_cta_article_coach_apa');
});

test('les événements de campagnes longues respectent la limite Umami', () => {
	const campaign = 'blog_activite-physique-adaptee-cancer-du-sein';
	const events = [
		quizCtaEvent(campaign),
		offerCtaEvent(campaign),
		tunnelCtaEvent(campaign),
		whatsappCtaEvent(campaign),
	];

	for (const event of events) assert.ok(event.length <= 50, event);
	assert.equal(new Set(events).size, events.length);
});
