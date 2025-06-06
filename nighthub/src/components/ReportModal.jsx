import React, { useState } from 'react';
import '../styles/main.css';

const ReportModal = ({ onSubmit, onClose }) => {
  const [reason, setReason] = useState('');

  const reasons = [
    'Inappropriate language',
    'Harassment',
    'Spam',
    'Other',
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Report User</h2>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input"
        >
          <option value="">Select a reason</option>
          {reasons.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <div className="modal-actions">
          <button
            onClick={() => onSubmit(reason)}
            disabled={!reason}
            className="btn primary"
          >
            Submit Report
          </button>
          <button onClick={onClose} className="btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;