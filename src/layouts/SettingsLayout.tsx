import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import NavBar from '~/components/NavBar';

interface SettingsLayoutProps extends PropsWithChildren {
  className?: string;
}

export default function SettingsLayout({
  className = '',
  children,
}: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-4">
      <Head>
        <title>Preferences</title>
      </Head>

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
            <Link href="/preferences/personalData">Personal Data</Link>
          </li>
        </ul>

        <div className="prose w-full py-5">{children}</div>
      </main>
    </div>
  );
}
