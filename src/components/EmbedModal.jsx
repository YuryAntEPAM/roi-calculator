import { useState, useEffect, useRef } from 'react';
import { buildIframeSnippet } from '../utils/embedUrl';

/**
 * EmbedModal — shows the iframe embed snippet in a modal dialog.
 *
 * Props:
 *   values          — current Scenario 1 form values
 *   comparisonMode  — whether the second scenario is active
 *   values2         — current Scenario 2 form values
 *   isDark          — current theme (passed into the embed URL)
 *   onClose         — called when the user dismisses the modal
 */
function EmbedModal({ values, comparisonMode, values2, isDark, onClose }) {
  const snippet = buildIframeSnippet(values, comparisonMode, values2, isDark);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  // Auto-select all text when the modal opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleCopy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Close when clicking the backdrop (outside the dialog box)
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Embed widget">
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Embed this Calculator</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        {/* Description */}
        <p className="modal-description">
          Copy the code below and paste it into any webpage to embed the ROI
          calculator pre-filled with your current values.
        </p>

        {/* Snippet textarea */}
        <textarea
          ref={textareaRef}
          className="modal-snippet"
          value={snippet}
          readOnly
          rows={7}
          spellCheck={false}
          onClick={(e) => e.target.select()}
        />

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-copy" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
          <button className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmbedModal;
