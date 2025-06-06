import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (agreed) {
      navigate('/chat');
    } else {
      alert('Please agree to the Terms of Service.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Welcome to NightHub</h1>
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
        <div className="h-40 overflow-y-auto mb-4 bg-gray-700 p-4 rounded">
          <p>
            By using NightHub.io, you agree to maintain respectful communication, anonymity, and adhere to our community guidelines. You must be 18 or older to use this service. Do not share personal information or engage in harassment, spam, or illegal activities. NightHub reserves the right to ban users for violations. Chats are encrypted for privacy, but admins/moderators may review reports for moderation purposes.
          </p>
          <p className="mt-2">
            We use cookies for session management and collect no personal data except IP addresses for moderation. For full details, review our Privacy Policy at nighthub.io/privacy.
          </p>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="tos"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-5 w-5 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="tos" className="ml-2 text-sm">
            I am 18 or older and agree to the Terms of Service.
          </label>
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
        >
          Continue to Chat
        </button>
      </div>
    </div>
  );
};

export default Index;
