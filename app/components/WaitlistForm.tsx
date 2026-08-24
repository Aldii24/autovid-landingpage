'use client';

import {FormEvent, useState} from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function WaitlistForm() {
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'submitting') return;
    setState('submitting');
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: form.get('email'),
          creatorType: form.get('creatorType'),
          website: form.get('website'),
          consent: form.get('consent') === 'on',
        }),
      });
      const result = await response.json() as {ok?: boolean; message?: string};
      if (!response.ok || !result.ok) throw new Error(result.message || 'Unable to join right now.');
      setState('success');
      setMessage(result.message || 'You’re on the list.');
      event.currentTarget.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to join right now.');
    }
  }

  return (
    <form className="waitlist-form" onSubmit={submit}>
      <div className="waitlist-fields">
        <label><span>Email address</span><input required name="email" type="email" autoComplete="email" placeholder="you@channel.com" maxLength={254} /></label>
        <label><span>I create</span><select name="creatorType" defaultValue="YouTube videos"><option>YouTube videos</option><option>Short-form videos</option><option>Client content</option><option>Still exploring</option></select></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="button" disabled={state === 'submitting'} type="submit">{state === 'submitting' ? 'Joining…' : 'Request an invite'} <span>↗</span></button>
      </div>
      <label className="consent"><input required name="consent" type="checkbox" /> <span>I agree to receive AutoVid beta and product updates. I can unsubscribe anytime.</span></label>
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </form>
  );
}
