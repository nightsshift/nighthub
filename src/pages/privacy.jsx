import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8 font-montserrat">
      <h1 className="text-4xl font-bold text-[#00BFFF] mb-6">Privacy Policy</h1>
      <p className="mb-6">Last Updated: June 13, 2025</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">1. What We Collect</h2>
      <p className="mb-4">No personal data like names or emails unless you break rules. We log IPs only if reported. Settings (theme, bookmarks) stay on your device.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">2. Cookies and Storage</h2>
      <p className="mb-4">Cookies manage anonymous sessions (unique ID). Local storage holds settings. We don’t track you across sites.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">3. Sharing Data</h2>
      <p className="mb-4">We share data only if required by law (e.g., illegal content). Reported users’ IPs may be shared to protect users.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">4. Data Security</h2>
      <p className="mb-4">Text chats are end-to-end encrypted. Video uses WebRTC encryption. We use top security, but no system is 100% safe.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">5. International Users</h2>
      <p className="mb-4">For EU (GDPR) and California (CCPA) users, we collect minimal data. Opt out of cookies in browser settings. Email support@nighthub.io for data requests.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">6. Changes to Policy</h2>
      <p className="mb-4">We may update this policy. Using NightHub means you accept updates.</p>
      <p className="mb-4">Contact: support@nighthub.io</p>
      <Link href="/" className="text-[#00BFFF] hover:text-[#A100F2]">Back to Home</Link>
    </div>
  );
}