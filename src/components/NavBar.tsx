import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { type FC } from 'react';

const NavBar: FC = () => {
  const { status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Personal Data DBMS
        </Link>
      </div>

      {status === 'authenticated' && (
        <div className="flex gap-4">
          <Link href="/preferences/general">
            <button className="btn-info btn">Preferences</button>
          </Link>

          <button className="btn-error btn" onClick={handleSignOut}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
