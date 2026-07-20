import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@components/ui/Card';
import { cn } from '@utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  change?: number;
  changeLabel?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  change,
  changeLabel,
  loading,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-2 text-3xl font-bold">{value}</p>
          )}
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {isPositive && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">+{change}%</span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">{change}%</span>
                </>
              )}
              {changeLabel && (
                <span className="text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-3', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </Card>
  );
};
