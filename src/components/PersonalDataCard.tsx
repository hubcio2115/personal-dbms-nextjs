import { type PersonalData } from '@prisma/client';
import Link from 'next/link';

interface PersonalDataProps extends PersonalData {
  email?: string;
}

export default function PersonalDataCard({
  id,
  firstName,
  lastName,
  maidenName,
}: PersonalDataProps) {
  return (
    <Link
      href={id}
      className="card h-32 w-80 justify-self-center bg-primary-content text-primary shadow-xl hover:cursor-pointer"
    >
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${maidenName} ${lastName}`}</h2>
      </div>
    </Link>
  );
}
