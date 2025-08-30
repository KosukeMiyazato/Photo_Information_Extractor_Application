'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const percent = Math.min(Math.max(Number(value) || 0, 0), 100);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full bg-primary transition-all"
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
