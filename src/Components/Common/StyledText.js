import React from 'react';

export default function StyledText({
  children,
  onClick,
  link,
  customStyle = {},
  fontSize = '16px',
  fontWeight = 400,
  letterSpacing = '-0.08px',
  color = 'black',
}) {
  return (
    <p
      style={{
        ...customStyle,
        ...styles.text,
        fontSize,
        fontWeight,
        letterSpacing,
        color: link ? 'blue' : color,
        cursor: link ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {children}
    </p>
  );
}

const styles = {
  text: {
    fontFamily: 'Inter',
    margin: '10px 0px 10px 0px',
  },
};
