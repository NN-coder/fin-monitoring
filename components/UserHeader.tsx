import { memo } from 'react';
import { getFormattedDate } from '../utils/getFormattedDate';

const getInitials = (name: string) =>
  name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(([initial]) => initial.toUpperCase())
    .join('');

export interface Props {
  image?: string;
  name?: string;
  date: Date;
}

export const UserHeader = memo<Props>(({ image, name = 'Аноним', date }) => (
  <div className="flex items-center flex-wrap">
    {image ? (
      <img aria-hidden src={image} alt="" className="w-8 h-8 rounded-full" />
    ) : (
      <div
        aria-hidden
        className="w-8 h-8 flex justify-center items-center rounded-full font-medium text-sm text-white bg-blue-500"
      >
        {getInitials(name)}
      </div>
    )}
    <span className="font-medium mx-2">{name}</span>
    <time dateTime={date.toString()} className="text-neutral-500">
      {getFormattedDate(date)}
    </time>
  </div>
));

UserHeader.displayName = 'UserHeader';
