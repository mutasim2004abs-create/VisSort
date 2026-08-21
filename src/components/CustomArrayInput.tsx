import { useState } from 'react';
import { parseArrayInput } from './parseArrayInput';

interface Props {
  onApply: (values: number[]) => void;
  disabled?: boolean;
}

export function CustomArrayInput({ onApply, disabled }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = parseArrayInput(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onApply(result.values);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="custom-array" className="text-[11px] uppercase tracking-wide text-muted">
        Your own numbers
      </label>
      <div className="flex gap-2">
        <input
          id="custom-array"
          type="text"
          /*
           * Deliberately NOT inputMode="numeric". That renders a digits-only
           * keypad on iOS with no comma and no space, so a phone visitor had no
           * way to separate one number from the next and simply left. The
           * standard keyboard is slightly slower to type digits on, but it is
           * the one that can actually complete the task.
           */
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          value={value}
          disabled={disabled}
          placeholder="e.g. 5 2 9 1 7 3"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'custom-array-error' : 'custom-array-hint'}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          className="h-11 w-full rounded-md border border-subtle bg-surface-2 px-3 font-mono text-sm text-primary transition-colors duration-fast hover:border-strong focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-45"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          className="shrink-0 rounded-md bg-lime px-4 font-medium text-on-lime transition-[transform,background-color] duration-fast hover:bg-lime-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Use
        </button>
      </div>
      {error ? (
        <p id="custom-array-error" role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        <p id="custom-array-hint" className="text-xs text-muted">
          Separate them however you like — space, comma, or dash all work.
        </p>
      )}
    </div>
  );
}
