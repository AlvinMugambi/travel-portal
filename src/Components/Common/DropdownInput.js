import React, { useState } from 'react';
import StyledText from './StyledText';

export default function DropdownInput({
  label,
  items,
  onSearch,
  onSelect,
  width = 50,
  height = 40,
  border = 0,
  customStyles,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredItem, setHoveredItem] = useState();

  const handleMouseEnter = (index) => {
    setIsHovering(true);
    setHoveredItem(index);
  };

  const handleMouseLeave = (index) => {
    setIsHovering(false);
    setHoveredItem(index);
  };

  return (
    <div style={{ ...customStyles }}>
      <StyledText fontSize="16px" fontWeight={400}>
        {label}
      </StyledText>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...styles.input, width, height, border }}
      >
        <StyledText fontSize="12px" color={selectedItem ? 'black' : 'grey'}>
          {selectedItem ? selectedItem.label : '--Select--'}
        </StyledText>
        <div>
          <img
            src={require('../../Assets/Icons/dropdown.png')}
            style={styles.dropdownImg}
          />
        </div>
      </div>

      {isOpen && (
        <div style={{ ...styles.dropdownLayout, width: width - 10 }}>
          <input
            style={styles.searchInput}
            placeholder="Search"
            onChange={(e) => {
              onSearch?.(e.target.value);
            }}
          />
          {items.map((item, index) => {
            return (
              <div
                style={{
                  ...styles.dropdownItems,
                  backgroundColor:
                    isHovering && hoveredItem === index
                      ? 'rgba(20, 52, 203, 0.30)'
                      : 'white',
                }}
                key={index}
              >
                <div
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedItem(item);
                    onSelect?.(item);
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  style={{
                    ...styles.dropdownItem,
                    borderBottom:
                      index !== items.length - 1 && '1px solid #EBEBEB',
                  }}
                >
                  <StyledText fontWeight={400} fontSize="12px">
                    {item.label}
                  </StyledText>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 10,
    cursor: 'pointer',
  },
  dropdownImg: {
    width: 20,
    height: 20,
    paddingRight: 10,
  },
  dropdownLayout: {
    height: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '10px',
    position: 'absolute',
    boxShadow: '-1px 4px 9px -8px rgba(0,0,0,0.75)',
  },
  searchInput: {
    height: 30,
    borderRadius: '10px',
    border: 0,
    paddingLeft: 10,
    border: '1px solid grey',
  },
  dropdownItems: {
    maxHeight: 200,
    overflowY: 'scroll',
  },
  dropdownItem: {
    borderBottom: '1px solid #EBEBEB',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px 5px 10px',
    cursor: 'pointer',
  },
};
