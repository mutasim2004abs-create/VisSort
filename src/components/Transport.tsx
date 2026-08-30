import type { PlaybackStatus } from '../hooks/usePlayback';
import { PlayIcon, PauseIcon, StepForwardIcon, StepBackIcon, ResetIcon } from './icons';

interface Props {
  status: PlaybackStatus;
  index: number;
  total: number;
  onToggle: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

function GhostButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-12 w-12 place-items-center rounded-full text-secondary transition-colors duration-fast hover:bg-accent-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function Transport({
  status,
  index,
  total,
  onToggle,
  onStepBack,
  onStepForward,
  onReset,
}: Props) {
  const playing = status === 'playing';
  const atStart = index === 0;
  const atEnd = index >= total;

  return (
    <div className="pointer-events-none sticky bottom-4 z-30 mt-4 flex justify-center px-4">
      {/* Content necessarily passes behind a sticky dock. Fade the strip it
          floats over into the page colour so the narration and legend dissolve
          under it rather than colliding with the controls. Phones only — the
          dock is a small centred pill on a wide screen. */}
      <div aria-hidden="true" className="dock-scrim sm:hidden" />
      <div className="glass pointer-events-auto flex items-center gap-1 rounded-full border border-subtle px-2 py-1.5">
        <GhostButton onClick={onReset} disabled={atStart && status === 'idle'} label="Reset">
          <ResetIcon />
        </GhostButton>
        <GhostButton onClick={onStepBack} disabled={atStart} label="Step back">
          <StepBackIcon />
        </GhostButton>

        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? 'Pause' : 'Play'}
          title={playing ? 'Pause' : 'Play'}
          className="mx-1 grid h-14 w-14 place-items-center rounded-full bg-accent text-on-accent shadow-e2 transition-[transform,background-color] duration-fast hover:bg-accent-hover active:scale-95"
        >
          {playing ? <PauseIcon width={26} height={26} /> : <PlayIcon width={26} height={26} />}
        </button>

        <GhostButton onClick={onStepForward} disabled={atEnd} label="Step forward">
          <StepForwardIcon />
        </GhostButton>

        <div className="ml-1 mr-2 min-w-[74px] px-1 text-right font-mono text-xs tabular-nums text-muted">
          {index.toLocaleString('en-US')}
          <span className="opacity-50"> / {total.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
}
