import { Warning, ArrowCounterClockwise, House } from "@phosphor-icons/react";
import { Button } from "./components/ui/button";

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  if (import.meta.env.DEV) throw error;

  const handleReturnToMenu = () => {
    window.location.hash = '';
    resetErrorBoundary();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center">
            <Warning size={24} weight="bold" className="text-destructive" />
          </div>
          <h1 className="text-xl font-bold font-mono text-primary">System Error</h1>
          <p className="text-xs text-foreground/60">
            An unexpected fault occurred. Review the diagnostic output below.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-mono text-foreground/40 mb-2 uppercase tracking-wider">
            Diagnostic Output
          </p>
          <pre className="text-xs font-mono text-destructive bg-muted/30 p-3 rounded border border-border overflow-auto max-h-32">
{error.message}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleReturnToMenu}
            variant="outline"
            className="flex-1"
          >
            <House size={16} weight="bold" />
            Main Menu
          </Button>
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            className="flex-1"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
