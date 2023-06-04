import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import NavBar from '~/components/NavBar';

interface MainLayoutProps extends PropsWithChildren {
  className?: string;
}

export default function MainLayout({
  className = '',
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-4">
      <nav>
        <NavBar />
      </nav>

      <main className={clsx('container mx-auto flex flex-auto', className)}>
        {children}
      </main>
    </div>
  );
}
