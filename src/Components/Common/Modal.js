import React from 'react';

const Modal = ({
  isVisible,
  onClose,
  width,
  height,
  className,
  containerStyle,
  children,
}) => {
  const handleClose = (event) => {
    event.stopPropagation();
    if (event.currentTarget.id === 'wrapper') onClose();
  };

  const handleModal = (event) => event.stopPropagation();

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 52, 203, 0.30)',
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black
      bg-opacity-80 ${containerStyle || ''}`}
      id="wrapper"
      onClick={handleClose}
    >
      <div
        style={{
          height: height || 'inherit',
          width: width || 600,
          borderRadius: 10,
          backgroundColor: 'white',
        }}
        className={`h-[${height || 'inherit'}] w-[${
          width || '600px'
        }] rounded-lg bg-white ${className || ''}`}
        id="modal"
        onClick={handleModal}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
