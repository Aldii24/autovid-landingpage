import {joinWaitlist} from '../../../db/waitlist';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const allowedCreatorTypes = new Set(['YouTube videos', 'Short-form videos', 'Client content', 'Still exploring']);

export async function POST(request: Request) {
  try {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 10_000) return Response.json({ok: false, message: 'Request is too large.'}, {status: 413});
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ok: true, message: 'You’re on the list.'});
    const email = String(body.email || '').trim().toLowerCase();
    const creatorType = allowedCreatorTypes.has(String(body.creatorType)) ? String(body.creatorType) : 'Still exploring';
    if (!body.consent) return Response.json({ok: false, message: 'Please confirm that we may send beta updates.'}, {status: 400});
    if (email.length > 254 || !emailPattern.test(email)) return Response.json({ok: false, message: 'Enter a valid email address.'}, {status: 400});
    const result = await joinWaitlist(email, creatorType);
    return Response.json({ok: true, message: result.created ? 'You’re on the list. We’ll be in touch.' : 'You’re already on the list.'});
  } catch (error) {
    console.error('Waitlist submission failed:', error);
    return Response.json({ok: false, message: 'The waitlist is temporarily unavailable. Please try again.'}, {status: 500});
  }
}
