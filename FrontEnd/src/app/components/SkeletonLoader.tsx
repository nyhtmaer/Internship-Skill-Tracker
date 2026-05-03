import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseStyles = 'bg-muted';
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height={12} />
        <Skeleton width="85%" height={12} />
        <Skeleton width="90%" height={12} />
      </div>
      <div className="flex gap-2">
        <Skeleton width={80} height={28} variant="rounded" />
        <Skeleton width={80} height={28} variant="rounded" />
        <Skeleton width={80} height={28} variant="rounded" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="space-y-2 mb-6">
        <Skeleton width="40%" height={24} />
        <Skeleton width="60%" height={16} />
      </div>
      <Skeleton width="100%" height={240} variant="rounded" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <Skeleton width="30%" height={24} className="mb-6" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton width="70%" height={16} />
              <Skeleton width="50%" height={12} />
            </div>
            <Skeleton width={100} height={32} variant="rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton variant="rounded" width={40} height={40} />
              <Skeleton width={40} height={20} variant="rounded" />
            </div>
            <Skeleton width="50%" height={32} className="mb-2" />
            <Skeleton width="70%" height={16} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <SkeletonChart />
        </div>
        <SkeletonChart />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
