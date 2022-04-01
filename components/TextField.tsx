import clsx from 'clsx';
import { nanoid } from 'nanoid';
import {
  forwardRef,
  memo,
  ReactNode,
  RefCallback,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const resizeTextField = (textField: HTMLTextAreaElement) => {
  textField.style.height = 'auto';
  textField.style.height = `${textField.scrollHeight}px`;
};

export interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'aria-invalid'> {
  label?: string;
  invalid?: boolean;
  errorText?: string;
  submitOnEnter?: boolean;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
}

export const TextField = memo(
  forwardRef<HTMLTextAreaElement, Props>(
    (
      {
        id,
        value,
        onInput,
        onKeyDown,
        onFocus,
        onBlur,
        label,
        className,
        invalid,
        disabled,
        required,
        errorText = label,
        startAdornment,
        endAdornment,
        submitOnEnter = true,
        rows = 1,
        ...props
      },
      forwardedRef
    ) => {
      const [textFieldInstance, setTextFieldInstance] = useState<HTMLTextAreaElement | null>(null);

      useLayoutEffect(() => {
        if (textFieldInstance) resizeTextField(textFieldInstance);
      }, [textFieldInstance, value, rows]);

      const ref: RefCallback<HTMLTextAreaElement> = useCallback(
        (instance) => {
          if (forwardedRef) {
            if (typeof forwardedRef === 'function') forwardedRef(instance);
            else forwardedRef.current = instance;
          }

          setTextFieldInstance(instance);
        },
        [forwardedRef]
      );

      const handleInput: Exclude<typeof onInput, undefined> = useCallback(
        (event) => {
          resizeTextField(event.target as HTMLTextAreaElement);
          onInput?.(event);
        },
        [onInput]
      );

      const handleKeyDown: Exclude<typeof onKeyDown, undefined> = useCallback(
        (event) => {
          if (submitOnEnter && event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!event.repeat) (event.target as Element).closest('form')?.requestSubmit();
          }

          onKeyDown?.(event);
        },
        [submitOnEnter, onKeyDown]
      );

      const [isInFocus, setIsInFocus] = useState(false);

      const handleFocus: Exclude<typeof onFocus, undefined> = useCallback(
        (event) => {
          setIsInFocus(true);
          onFocus?.(event);
        },
        [onFocus]
      );

      const handleBlur: Exclude<typeof onBlur, undefined> = useCallback(
        (event) => {
          setIsInFocus(false);
          onBlur?.(event);
        },
        [onBlur]
      );

      const idRef = useRef(nanoid());

      return (
        <div
          className={clsx(
            'relative flex rounded-lg outline outline-current duration-150',
            disabled ? 'outline-0' : isInFocus ? 'outline-2' : 'outline-1',
            disabled
              ? 'text-neutral-500 bg-neutral-200'
              : invalid
              ? 'text-red-600'
              : isInFocus
              ? 'text-black'
              : 'text-neutral-500',
            className
          )}
        >
          <label
            htmlFor={id ?? idRef.current}
            className={clsx(
              'absolute left-3 top-0 px-1 origin-top-left select-none duration-[inherit]',
              disabled ? 'bg-transparent cursor-default' : 'bg-white cursor-text',
              isInFocus || textFieldInstance?.value
                ? 'scale-75 -translate-y-[0.625rem]'
                : 'translate-y-2'
            )}
          >
            {invalid ? errorText : label}
          </label>
          {startAdornment}
          <textarea
            id={id ?? idRef.current}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={invalid}
            className="w-full px-4 py-2 resize-none text-black focus:outline-none"
            {...{ value, disabled, required, rows, ref }}
            {...props}
          />
          {endAdornment}
        </div>
      );
    }
  )
);

TextField.displayName = 'TextField';
