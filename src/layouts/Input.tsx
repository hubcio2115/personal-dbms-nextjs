import type { PropsWithChildren } from 'react';

interface InputProps extends PropsWithChildren {
  label: string;
  errorMessage?: string;
}

export default function Input({ label, errorMessage, children }: InputProps) {
  return (
    <div className="form-control">
      <label className="label text-primary-content">
        <span className="label-text">{label}: </span>
      </label>

      {children}

      <label className="label">
        {!!errorMessage && (
          <span className="label-text-alt">{errorMessage}</span>
        )}
      </label>
    </div>
  );
}
