import clsx from 'clsx';
import {
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
>(({ value, onInput, rows = 1, className, onKeyDown, ...props }, forwardedRef) => {
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

  const handleInput: Exclude<typeof onInput, undefined> = useCallback(
    (event) => {
      resizeTextarea(event.target as HTMLTextAreaElement);
      onInput?.(event);
    },
    [onInput]
  );

  const handleKeyDown: Exclude<typeof onKeyDown, undefined> = useCallback(
    (event) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!event.repeat) (event.target as HTMLTextAreaElement).closest('form')?.requestSubmit();
      }

      onKeyDown?.(event);
    },
    [onKeyDown]
  );

  return (
    <textarea
      ref={ref}
      value={value}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
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
