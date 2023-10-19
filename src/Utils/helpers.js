import { format } from "date-fns";

export const capitalizeFLetter = (str) => {
  if (str) {
    return str.replace(/^./, str[0].toUpperCase());
  } else {
    return '';
  }
};


export const formatDate = (date) => {
  let _date
  try {
    _date = format(new Date(date), 'PPP')
  } catch (error) {
    console.log('formatDate error==>', error);
    _date = date
  }
  return _date
}