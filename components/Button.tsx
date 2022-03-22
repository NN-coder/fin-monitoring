import clsx from 'clsx';
import { ButtonHTMLAttributes, memo } from 'react';

export const Button = memo<ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ type = 'button', className, disabled, children, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-lg',
        disabled && '!cursor-default !bg-neutral-200 !text-neutral-500',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
