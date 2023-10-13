import React from 'react';
import StyledText from './StyledText';

export default function Button({
  label,
  disabled,
  customStyles = {},
  onClick = () => {},
  width = 100,
  height = 57,
  backgroundColor = '#1434CB',
  labelColor = '#ffffff',
}) {
  return (
    <div
      style={{ ...styles.btn, ...customStyles, backgroundColor, width, height }}
      onClick={() => !disabled && onClick()}
    >
      <StyledText color={labelColor}>{label}</StyledText>
    </div>
  );
}

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 5,
  },
};
