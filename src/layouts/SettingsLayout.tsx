import clsx from 'clsx';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import NavBar from '../components/NavBar';

interface SettingsLayoutProps {
  className?: string;
}

const SettingsLayout: FC<PropsWithChildren<SettingsLayoutProps>> = ({
  className = '',
  children,
}) => (
  <div className="flex min-h-screen flex-col pb-4">
    <nav>
      <NavBar />
    </nav>

    <main
      className={clsx(
        'container mx-auto flex flex-auto justify-center py-4',
        className,
      )}
    >
      <ul className="menu rounded-box w-56 bg-base-100 p-2">
        <li>
          <Link href="/preferences/general">General</Link>
        </li>
        <li>
          <Link href="/preferences/technicalSupportForm">
            Technical Support
          </Link>
        </li>
      </ul>

      <div className="prose w-full py-5">{children}</div>
    </main>
  </div>
);

export default SettingsLayout;
