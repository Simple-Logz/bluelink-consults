import React from 'react';
import { useLocation } from 'react-router-dom';
import { consultationServices } from './engagementContent';

export default function ConsultationFields() {
  const { search } = useLocation();
  const requested = new URLSearchParams(search).get('service');
  const selected = consultationServices.find(s => s.slug === requested)?.title || '';
  return <>
    <label>Full Name<input required minLength={2} maxLength={200} name="name" autoComplete="name" placeholder="Your name" /></label>
    <label>Business Email<input required name="email" type="email" maxLength={320} autoComplete="email" placeholder="you@company.com" /></label>
    <label>Service of Interest<select required name="service" defaultValue={selected}><option value="" disabled>Select a service</option>{consultationServices.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}<option>Not sure yet — help me choose</option></select></label>
    <label>Your technology challenge<textarea required name="message" rows={4} minLength={5} maxLength={10000} placeholder="Briefly describe what needs to work better and the outcome you want." /></label>
    <details className="bl-optional-details"><summary>Add organization and phone details (optional)</summary><div>
      <label>Organization<input name="company" maxLength={200} autoComplete="organization" placeholder="Organization name" /></label>
      <label>Phone Number<input name="phone" type="tel" maxLength={50} autoComplete="tel" placeholder="Include your country code" /></label>
    </div></details>
    <small>We will use these details to respond to your inquiry. Please do not include passwords or confidential system data. <a href="/privacy-policy">Privacy policy</a></small>
  </>;
}
