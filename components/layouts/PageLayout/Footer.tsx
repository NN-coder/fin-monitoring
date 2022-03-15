import clsx from 'clsx';
import { FC, ReactElement } from 'react';
import { IconBase, IconContext } from 'react-icons';
import { BsTelephone, BsInstagram, BsEnvelope } from 'react-icons/bs';

interface LinkProps {
  href: string;
  label: string;
  icon: ReactElement;
}

const Link: FC<LinkProps> = ({ href, label, icon }) => (
  <a href={href} title={label} target="_blank" rel="noreferrer noopener" className="w-6 h-6 mx-2">
    {icon}
  </a>
);

export const Footer: FC = () => (
  <footer
    className={clsx(
      'mt-auto py-8 px-4 w-full text-white bg-black',
      'flex flex-col items-center text-center'
    )}
  >
    <div className="flex">
      <IconContext.Provider value={{ size: '100%', color: 'white', attr: { 'aria-hidden': true } }}>
        <Link href="tel:+78482546389" label="Позвонить нам" icon={<BsTelephone />} />
        <Link
          href="https://instagram.com/projects_tsu"
          label="Проекты ТГУ в инстаграм"
          icon={<BsInstagram />}
        />
        <Link
          href="mailto:mail@fin-monitoring.com"
          label="Написать нам на почту"
          icon={<BsEnvelope />}
        />
        <Link
          href="https://vk.com/club152633580"
          label="Проекты ТГУ ВКонтакте"
          icon={
            <IconBase>
              <path d="M15.9167 0C18.2981 0 19.4433 0.221138 20.6331 0.857476C21.7121 1.43453 22.5655 2.28785 23.1425 3.36686C23.7789 4.55669 24 5.70187 24 8.08331V15.9167C24 18.2981 23.7789 19.4433 23.1425 20.6331C22.5655 21.7121 21.7121 22.5655 20.6331 23.1425C19.4433 23.7789 18.2981 24 15.9167 24H8.08331C5.70187 24 4.55669 23.7789 3.36686 23.1425C2.28785 22.5655 1.43453 21.7121 0.857476 20.6331C0.221138 19.4433 0 18.2981 0 15.9167V8.08331C0 5.70187 0.221138 4.55669 0.857476 3.36686C1.43453 2.28785 2.28785 1.43453 3.36686 0.857476C4.55669 0.221138 5.70187 0 8.08331 0H15.9167ZM15.9167 2.18182H8.08331C6.03124 2.18182 5.22635 2.33725 4.3958 2.78143C3.69703 3.15514 3.15514 3.69703 2.78143 4.3958C2.33725 5.22635 2.18182 6.03124 2.18182 8.08331V15.9167C2.18182 17.9688 2.33725 18.7737 2.78143 19.6042C3.15514 20.303 3.69703 20.8449 4.3958 21.2186C5.22635 21.6627 6.03124 21.8182 8.08331 21.8182H15.9167C17.9688 21.8182 18.7737 21.6627 19.6042 21.2186C20.303 20.8449 20.8449 20.303 21.2186 19.6042C21.6627 18.7737 21.8182 17.9688 21.8182 15.9167V8.08331C21.8182 6.03124 21.6627 5.22635 21.2186 4.3958C20.8449 3.69703 20.303 3.15514 19.6042 2.78143C18.7737 2.33725 17.9688 2.18182 15.9167 2.18182Z" />
              <path d="M12.7111 16C7.98172 16 5.11242 12.9964 5 8H7.39528C7.46996 11.6702 9.2922 13.2216 10.6892 13.5414V8H12.9846V11.1693C14.332 11.0324 15.7422 9.58992 16.2163 8H18.4757C18.1141 9.95505 16.5788 11.3913 15.494 11.9856C16.5796 12.4661 18.3263 13.7251 19 16H16.5166C15.9923 14.4793 14.7078 13.3076 12.9854 13.1477V16H12.7111Z" />
            </IconBase>
          }
        />
      </IconContext.Provider>
    </div>
    <p className="mt-7">&copy; Центр Финансово-Правовых Инициатив {new Date().getFullYear()}</p>
  </footer>
);
