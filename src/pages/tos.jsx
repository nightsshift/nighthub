import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8 font-montserrat">
      <h1 className="text-4xl font-bold text-[#00BFFF] mb-6">Terms of Service</h1>
      <p className="mb-6">Last Updated: June 13, 2025</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">1. Accepting These Terms</h2>
      <p className="mb-4">You must agree to these Terms to use NightHub (nighthub.io). If you don’t agree, don’t use NightHub. You must be 13+. For mature content, you must be 18+.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">2. Your Behavior</h2>
      <p className="mb-4">Don’t post illegal, harmful, or NSFW content. Don’t harass or threaten others. Don’t hack our systems. Breaking rules may lead to bans and IP logging.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">3. Anonymity</h2>
      <p className="mb-4">NightHub is anonymous. We don’t collect names or emails. If you break rules, we may log your IP to protect users or comply with laws.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">4. Content Moderation</h2>
      <p className="mb-4">We review reported content. We may remove posts, ban users, or share data with authorities if required. Use reporting tools to flag issues.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">5. Freedom of Speech</h2>
      <p className="mb-4">NightHub champions free speech. We comply with local laws to stay online. If a government restricts us, we’ll fight legally to protect your rights.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">6. No Liability</h2>
      <p className="mb-4">NightHub isn’t responsible for user actions or content. You use NightHub at your own risk. We don’t guarantee performance.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">7. Disputes</h2>
      <p className="mb-4">Disputes go to arbitration in Delaware, USA. No lawsuits against NightHub. Delaware law applies.</p>
      <h2 className="text-2xl font-bold text-[#00BFFF] mb-3">8. Changes to Terms</h2>
      <p className="mb-4">We may update these Terms. Using NightHub means you accept updates.</p>
      <Link href="/" className="text-[#00BFFF] hover:text-[#A100F2]">Back to Home</Link>
    </div>
  );
}