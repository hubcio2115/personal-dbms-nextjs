import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { type FC } from 'react';

const NavBar: FC = () => {
  const { status } = useSession();

  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Personal Data DBMS
        </Link>
      </div>

      {status === 'authenticated' ? (
        <button className="btn-error btn" onClick={() => signOut()}>
          Log out
        </button>
      ) : null}
    </div>
  );
};

export default NavBar;
