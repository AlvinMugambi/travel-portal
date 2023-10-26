import React from 'react';

const URL = 'https://wa.me';

export default function WhatsappContact({
  number,
  message,
  children,
  onClick,
}) {
  number = number?.replace(/[^\w\s]/gi, '').replace(/ /g, '');
  let url = `${URL}/${number}`;

  if (message) {
    url += `?text=${encodeURI(message)}`;
  }

  return (
    <div
      onClick={() => {
        window.open(url);
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
}
