import React from 'react';

export default function FormView({ children, width = 'auto' }) {
  return <div style={{ ...styles.layout, width }}>{children}</div>;
}

const styles = {
  layout: {
    padding: '20px 20px 30px 20px',
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
  },
};
