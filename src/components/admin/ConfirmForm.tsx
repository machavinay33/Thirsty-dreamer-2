'use client';

/** A form that asks for confirmation before running a (destructive) server action. */
export function ConfirmForm({ action, message, children, className }: { action: (fd: FormData) => void | Promise<void>; message: string; children: React.ReactNode; className?: string }) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
