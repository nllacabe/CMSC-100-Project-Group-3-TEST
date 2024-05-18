import { useState } from 'react';

export default function Popup({description, closePopup}) {
  return (
    <div>
        <p>{description}</p>
        <button onClick={() => closePopup()} className="close-popup-btn">✕ Close</button>
    </div>
  );
}