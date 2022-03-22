import clsx from 'clsx';
import {
  FormEventHandler,
  forwardRef,
  RefCallback,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ value, onInput, rows = 1, className, ...props }, forwardedRef) => {
  const [textareaInstance, setTextareaInstance] = useState<HTMLTextAreaElement | null>(null);

  const ref: RefCallback<HTMLTextAreaElement> = useCallback(
    (instance) => {
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') forwardedRef(instance);
        else forwardedRef.current = instance;
      }

      setTextareaInstance(instance);
    },
    [forwardedRef]
  );

  useLayoutEffect(() => {
    if (textareaInstance) resizeTextarea(textareaInstance);
  }, [textareaInstance, value]);

  const handleInput: FormEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      resizeTextarea(event.target as HTMLTextAreaElement);
      onInput?.(event);
    },
    [onInput]
  );

  return (
    <textarea
      ref={ref}
      value={value}
      onInput={handleInput}
      rows={rows}
      className={clsx(
        'px-4 py-2 resize-none rounded-lg bg-neutral-200 placeholder:text-neutral-500 placeholder:text-opacity-100',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
