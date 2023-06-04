import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import NavBar from '~/components/NavBar';

interface MainLayoutProps {
  className?: string;
}

const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  className = '',
  children,
}) => (
  <div className="flex min-h-screen flex-col pb-4">
    <nav>
      <NavBar />
    </nav>

    <main className={clsx('container mx-auto flex flex-auto', className)}>
      {children}
    </main>
  </div>
);

export default MainLayout;
