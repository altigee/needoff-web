import moment from 'moment';

export const FORMATS = {
  YYYYMMDD: 'YYYY-MM-DD',
  MMMMDoYYYY: 'MMMM Do YYYY',
};

export function format(date, display = FORMATS.YYYYMMDD) {
  const momentDate = moment(date);

  return (date && momentDate.isValid())
    ? momentDate.format(display)
    : '';
}