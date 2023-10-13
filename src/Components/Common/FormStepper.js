import React from 'react';
import StyledText from './StyledText';

export default function FormStepper({ steps, activeStep = 0 }) {
  return (
    <div style={styles.layout}>
      {steps.map((step, index) => (
        <div key={`${index}-${step.label}`}>
          <div style={styles.step}>
            <div
              style={{
                ...styles.outerCircle,
                ...styles.flexCenter,
                backgroundColor:
                  index === activeStep && !step.completed
                    ? '#1434CB'
                    : step.completed
                    ? '#1434CB'
                    : '#D9D9D9',
              }}
            >
              <div
                style={{
                  ...styles.innerCircle,
                  ...styles.flexCenter,
                  backgroundColor:
                    index === activeStep && !step.completed
                      ? '#FFF'
                      : step.completed
                      ? '#1434CB'
                      : '#FFF',
                }}
              >
                <StyledText
                  color={!step.completed ? 'black' : '#FFF'}
                  fontSize="25px"
                  fontWeight={700}
                >
                  {index + 1}
                </StyledText>
              </div>
            </div>
            <div style={{ marginLeft: 30 }}>
              <StyledText fontSize="20px" fontWeight={700}>
                {step.label}
              </StyledText>
            </div>
          </div>
          {index !== steps.length - 1 && (
            <div
              style={{
                ...styles.connector,
                backgroundColor: step.completed ? '#1434CB' : '#D9D9D9',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  connector: {
    backgroundColor: '#1434CB',
    width: 4,
    height: 77,
    position: 'relative',
    left: 25,
  },
  step: { display: 'flex', alignItems: 'center' },
};
