import moment from 'moment';

export const FORMATS = {
  DEFAULT: 'YYYY-MM-DD',
  SECONDARY: 'MMMM Do YYYY'
};

export function format(date, display = FORMATS.DEFAULT) {
  const momentDate = moment(date);

  return date && momentDate.isValid() ? momentDate.format(display) : '';
}
