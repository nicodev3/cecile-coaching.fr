const MAX_EVENT_NAME_LENGTH = 50;

const normalizeCampaign = (campaign: string) =>
	campaign
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_+|_+$/g, '');

const campaignEvent = (prefix: string, campaign: string) => {
	const normalized = normalizeCampaign(campaign) || 'unknown';
	return `${prefix}${normalized}`.slice(0, MAX_EVENT_NAME_LENGTH);
};

export const ANALYTICS_EVENTS = {
	quizViewed: 'quiz_viewed',
	quizStarted: 'quiz_started',
	quizCompleted: 'quiz_completed',
	quizLeadAttempted: 'quiz_lead_attempted',
	quizLeadInvalid: 'quiz_lead_invalid',
	quizLeadFailed: 'quiz_lead_failed',
	leadSubmitted: 'lead_submitted',
	bookingViewed: 'booking_viewed',
	bookingConfirmed: 'booking_confirmed',
} as const;

export const quizQuestionAnsweredEvent = (questionNumber: number) =>
	`quiz_question_${String(questionNumber).padStart(2, '0')}_answered`;

export const quizCtaEvent = (campaign: string) => campaignEvent('quiz_cta_', campaign);
export const offerCtaEvent = (campaign: string) => campaignEvent('offer_cta_', campaign);
export const tunnelCtaEvent = (campaign: string) => campaignEvent('tunnel_cta_', campaign);
export const whatsappCtaEvent = (campaign: string) => campaignEvent('whatsapp_cta_', campaign);
