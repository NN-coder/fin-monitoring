import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import { Nav } from './Nav';

export const Sidebar = memo(() => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'visible';

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isSidebarOpen]);

  const { asPath } = useRouter();
  useEffect(closeSidebar, [asPath]);

  return (
    <>
      <button
        type="button"
        onClick={openSidebar}
        title="Открыть меню"
        className="absolute top-0 right-0 p-3"
      >
        <MdMenu aria-hidden className="w-8 h-8" />
      </button>
      {isSidebarOpen && (
        <div className="fixed z-10 top-0 left-0 w-full h-full overflow-hidden p-4 bg-white">
          <svg
            aria-hidden
            width="98"
            height="24"
            viewBox="0 0 98 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_255_123)">
              <path d="M24 18.75H18.75V23.9965H24V18.75Z" fill="#15803D" />
              <path d="M17.75 18.75H12.5V23.9965H17.75V18.75Z" fill="#16A34A" />
              <path d="M11.5 18.75H6.25V23.9965H11.5V18.75Z" fill="#22C55E" />
              <path d="M5.25 18.75H0V23.9965H5.25V18.75Z" fill="#4ADE80" />
              <path d="M24 12.5H18.75V17.7465H24V12.5Z" fill="#15803D" />
              <path d="M17.75 12.5H12.5V17.7465H17.75V12.5Z" fill="#16A34A" />
              <path d="M11.5 12.5H6.25V17.7465H11.5V12.5Z" fill="#22C55E" />
              <path d="M24 6.25H18.75V11.4965H24V6.25Z" fill="#15803D" />
              <path d="M17.75 6.25H12.5V11.4965H17.75V6.25Z" fill="#16A34A" />
              <path d="M24 0H18.75V5.24649H24V0Z" fill="#15803D" />
              <path
                d="M42.4779 24H39.5739L39.1497 20.3636H26V3.32852e-05H30.1113V16.9891H35.9846V3.32852e-05H40.0959V16.9891H42.4779V24ZM51.4125 18.7346C51.0644 18.7927 50.7055 18.8315 50.3357 18.8509C49.9876 18.8703 49.5961 18.88 49.161 18.88C48.2909 18.88 47.4861 18.7249 46.7465 18.4146C46.0286 18.1042 45.3978 17.6194 44.854 16.96C44.3319 16.3006 43.9186 15.4667 43.614 14.4582C43.3095 13.4303 43.1572 12.1988 43.1572 10.7637C43.1572 8.04851 43.7446 5.96366 44.9192 4.50912C46.0939 3.05457 47.6818 2.3273 49.6831 2.3273C49.9006 2.3273 50.1834 2.337 50.5315 2.35639C50.9013 2.37579 51.1949 2.41458 51.4125 2.47276V3.32852e-05H55.5238V2.56003C55.8501 2.46306 56.2416 2.40488 56.6984 2.38548C57.1552 2.3467 57.5251 2.3273 57.8079 2.3273C58.678 2.3273 59.472 2.49215 60.1898 2.82185C60.9294 3.15154 61.5602 3.65579 62.0823 4.33457C62.6261 4.99397 63.0394 5.8376 63.3222 6.86548C63.6268 7.89336 63.779 9.09578 63.779 10.4727C63.779 11.8885 63.605 13.12 63.257 14.1673C62.9307 15.2146 62.4847 16.0873 61.9192 16.7855C61.3536 17.4836 60.6792 18.0073 59.8961 18.3564C59.113 18.7055 58.2864 18.88 57.4163 18.88C57.09 18.88 56.7528 18.8703 56.4048 18.8509C56.0785 18.8121 55.7848 18.7539 55.5238 18.6764V24H51.4125V18.7346ZM56.7637 5.49821C56.5897 5.49821 56.3504 5.5079 56.0459 5.5273C55.7413 5.54669 55.502 5.58548 55.328 5.64366V15.6509C55.4585 15.6897 55.6325 15.7091 55.8501 15.7091C56.0676 15.7091 56.2851 15.7091 56.5027 15.7091C57.438 15.7091 58.1994 15.3018 58.7867 14.4873C59.3741 13.6533 59.6677 12.3249 59.6677 10.5018C59.6677 8.93093 59.4176 7.70911 58.9172 6.83639C58.4387 5.94427 57.7208 5.49821 56.7637 5.49821ZM50.2704 15.7091C50.4227 15.7091 50.6294 15.7091 50.8904 15.7091C51.1732 15.6897 51.4125 15.6509 51.6082 15.5927V5.55639C51.4342 5.537 51.2384 5.5273 51.0209 5.5273C50.8034 5.5079 50.5967 5.49821 50.401 5.49821C49.4656 5.49821 48.7042 5.91518 48.1169 6.74911C47.5513 7.56366 47.2685 8.89214 47.2685 10.7346C47.2685 12.3443 47.5296 13.5758 48.0516 14.4291C48.5737 15.2824 49.3133 15.7091 50.2704 15.7091ZM76.4584 3.37458H70.5198V24H66.4085V3.64057e-05H80.5697V24H76.4584V3.37458ZM93.7647 10.9999L86.3186 24H83.0883V0H87.1997V14.1679L94.8023 0H98V24H93.8887L93.7647 10.9999Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_255_123">
                <rect width="98" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <button
            type="button"
            onClick={closeSidebar}
            title="Закрыть меню"
            className="absolute top-0 right-0 p-3"
          >
            <MdClose aria-hidden className="w-8 h-8" />
          </button>
          <Nav />
        </div>
      )}
    </>
  );
});

Sidebar.displayName = 'Sidebar';
