import React from 'react';
import StyledText from './StyledText';

export default function Input({
  label,
  type,
  width = 50,
  height = 40,
  backgroundColor = 'white',
  onChange,
  customStyles,
  placeholder,
  textArea,
}) {
  return (
    <div style={{ ...customStyles }}>
      {label && (
        <StyledText fontSize="16px" fontWeight={400}>
          {label}
        </StyledText>
      )}
      {textArea ? (
        <textarea
          style={{
            ...styles.input,
            backgroundColor,
            width,
            height: 60,
            paddingTop: 10,
          }}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
        />
      ) : (
        <input
          style={{ ...styles.input, backgroundColor, width, height }}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
        />
      )}
    </div>
  );
}

const styles = {
  input: {
    borderRadius: '10px',
    border: 0,
    paddingLeft: 10,
  },
};
