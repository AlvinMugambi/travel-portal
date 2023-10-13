import React from 'react';
import StyledText from './StyledText';

export default function Footer() {
  return (
    <div style={styles.footer}>
      <StyledText color="#ffffff">Visa TTP</StyledText>
    </div>
  );
}

const styles = {
  footer: {
    width: '98vw',
    height: 200,
    backgroundColor: '#1434CB',
    padding: 20,
  },
};
