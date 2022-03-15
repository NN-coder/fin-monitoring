import { FC } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const PageLayout: FC = ({ children }) => (
  <>
    <Header />
    <main className="p-4">{children}</main>
    <Footer />
  </>
);
