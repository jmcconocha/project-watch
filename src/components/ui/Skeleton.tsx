interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'skeleton'

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const defaultSizes = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '2.5rem', height: '2.5rem' },
    rectangular: { width: '100%', height: '4rem' },
  }

  const styles = {
    width: width ?? defaultSizes[variant].width,
    height: height ?? defaultSizes[variant].height,
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={styles}
      aria-hidden="true"
    />
  )
}

// Pre-built skeleton patterns
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 skeleton" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Skeleton variant="text" width="60%" height="1.25rem" />
          <Skeleton variant="text" width="4rem" height="1.25rem" className="rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-1.5 mb-3">
          <Skeleton variant="text" width="100%" height="0.875rem" />
          <Skeleton variant="text" width="80%" height="0.875rem" />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mb-3">
          <Skeleton variant="text" width="4rem" height="0.75rem" />
          <Skeleton variant="text" width="5rem" height="0.75rem" />
        </div>

        {/* Git Info */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Skeleton variant="text" width="4rem" height="1.5rem" className="rounded" />
          <Skeleton variant="text" width="5rem" height="1.5rem" className="rounded" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Skeleton variant="text" width="5rem" height="0.75rem" />
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="2rem" height="2rem" />
          <div className="space-y-1">
            <Skeleton variant="text" width="8rem" height="0.875rem" />
            <Skeleton variant="text" width="12rem" height="0.75rem" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" width="4rem" height="1.25rem" className="rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" width="3rem" height="1.25rem" className="rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="rectangular" width="6rem" height="0.5rem" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" width="4rem" height="1.25rem" className="rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" width="4rem" height="0.75rem" />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
          <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
        </div>
      </td>
    </tr>
  )
}
