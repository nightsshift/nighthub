import { Link } from 'react-router-dom';
import './Terms.css';

function Terms() {
  return (
    <div className="terms-page">
      <h1>NightHub Terms of Service</h1>
      <p><strong>Effective Date:</strong> June 7, 2025</p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using NightHub, you agree to be bound by these Terms of Service ("Terms").
        If you do not agree, you must not use our services. You must be at least 18 years old to
        use NightHub.
      </p>
      <h2>2. User Conduct</h2>
      <p>
        NightHub provides an anonymous 1-on-1 chat platform. You are solely responsible for your
        interactions and content shared. You agree not to use NightHub for any illegal,
        harmful, or offensive purposes, including but not limited to harassment, explicit content
        (unless NSFW mode is enabled), or violating any laws.
      </p>
      <h2>3. Anonymity and Privacy</h2>
      <p>
        NightHub does not collect personally identifiable information unless required by law.
        Chats are anonymous, and we do not store chat content after disconnection. However,
        absolute anonymity cannot be guaranteed due to the nature of internet communications.
      </p>
      <h2>4. Disclaimer of Liability</h2>
      <p>
        NightHub is not responsible for any user-generated content, interactions, or damages
        arising from your use of the platform. We provide the service "as is" without warranties
        of any kind. You use NightHub at your own risk.
      </p>
      <h2>5. Termination</h2>
      <p>
        We reserve the right to terminate or suspend access to NightHub at any time, without
        notice, for any reason, including violation of these Terms.
      </p>
      <h2>6. Changes to Terms</h2>
      <p>
        We may update these Terms at any time. Continued use of NightHub constitutes acceptance
        of the updated Terms.
      </p>
      <h2>7. Contact</h2>
      <p>
        For questions about these Terms, contact us at support@nighthub.io.
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Terms;