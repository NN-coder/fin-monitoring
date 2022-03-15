import { UserRole } from '@prisma/client';
import clsx from 'clsx';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC } from 'react';

const routes = {
  '/categories/all': 'Главная',
  '/categories/education': 'Финансовая грамотность',
  '/categories/blacklist': 'Чёрный список',
  '/creation': 'Предложить пост',
  '/about': 'О нас',
};

export const Nav: FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav
      className={clsx(
        'max-w-xs mx-auto mt-6 text-center',
        'xl:max-w-none xl:mx-0 xl:mt-0 xl:text-left xl:flex xl:items-center'
      )}
    >
      <ul className="contents">
        {Object.entries(routes).map(([href, label]) => (
          <li key={href} className="contents">
            <Link href={href}>
              <a className="block p-1 mb-2 xl:mb-0 xl:mr-2">{label}</a>
            </Link>
          </li>
        ))}
        {session?.user?.role === UserRole.ADMIN && (
          <li className="contents">
            <Link href="/admin">
              <a className="block p-1 mb-2 xl:mb-0 xl:mr-2">Админка</a>
            </Link>
          </li>
        )}
        <li className="contents">
          {status === 'authenticated' ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full xl:w-auto px-4 py-2 rounded-lg border border-green-700 text-green-700"
            >
              Выйти
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn('google')}
              className="w-full xl:w-auto px-4 py-2 rounded-lg bg-green-700 text-white"
            >
              Войти
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};
