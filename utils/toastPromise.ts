import { ReactNode } from 'react';
import { toast, Icons } from 'react-toastify';

interface ToastPromiseParams<T> {
  pending?: ReactNode;
  success?: ReactNode | ((data: T) => ReactNode);
  fail?: ReactNode | ((error: unknown) => ReactNode | Promise<ReactNode>);
}

export async function toastPromise<T>(
  promise: Promise<T>,
  { pending, success, fail }: ToastPromiseParams<T>
) {
  const toastId = toast(pending, { autoClose: false, icon: Icons.spinner });

  try {
    toast.update(toastId, {
      type: toast.TYPE.SUCCESS,
      icon: Icons.success,
      render: typeof success === 'function' ? await success(await promise) : success,
      autoClose: null,
    });
  } catch (error) {
    toast.update(toastId, {
      type: toast.TYPE.ERROR,
      icon: Icons.error,
      render: typeof fail === 'function' ? await fail(error) : fail,
      autoClose: null,
    });
  }
}
