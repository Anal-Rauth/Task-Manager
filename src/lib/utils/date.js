import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

export const formatDate = (value) =>
  value ? dayjs(value).format('MMM D, YYYY') : '';

export const fromNow = (value) => (value ? dayjs(value).fromNow() : '');

export const isOverdue = (value) =>
  value ? dayjs(value).isBefore(dayjs(), 'day') : false;
