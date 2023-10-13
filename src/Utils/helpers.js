export const capitalizeFLetter = (str) => {
  if (str) {
    return str.replace(/^./, str[0].toUpperCase());
  } else {
    return '';
  }
};
