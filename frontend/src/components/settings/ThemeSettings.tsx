import React from 'react';
import { Sun, Moon, Monitor, Palette, Type, Layout } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ThemeSettings: React.FC = () => {
  const [mode, setMode] = React.useState<'light' | 'dark' | 'system'>('system');
  const [accentColor, setAccentColor] = React.useState('#3b82f6');
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');
  const [compactMode, setCompactMode] = React.useState(false);

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
  ];

  const applyTheme = () => {
    // Apply theme settings
    document.documentElement.classList.remove('light', 'dark');
    
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(mode);
    }

    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('accent-color', accentColor);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('compact-mode', String(compactMode));
  };

  React.useEffect(() => {
    applyTheme();
  }, [mode, accentColor, fontSize, compactMode]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize the appearance of your application
        </p>
      </div>

      {/* Theme Mode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Theme Mode
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setMode('light')}
            className={cn(
              'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
              mode === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Sun className="w-8 h-8" />
            <span className="font-medium">Light</span>
          </button>

          <button
            onClick={() => setMode('dark')}
            className={cn(
              'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
              mode === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Moon className="w-8 h-8" />
            <span className="font-medium">Dark</span>
          </button>

          <button
            onClick={() => setMode('system')}
            className={cn(
              'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
              mode === 'system'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Monitor className="w-8 h-8" />
            <span className="font-medium">System</span>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Accent Color
        </h3>
        <div className="grid grid-cols-6 gap-4">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                accentColor === color.value
                  ? 'border-gray-900 dark:border-white'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <div
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Font Size
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={cn(
                'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all',
                fontSize === size
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              )}
            >
              <Type className={cn('w-6 h-6', size === 'small' && 'w-5 h-5', size === 'large' && 'w-8 h-8')} />
              <span className="font-medium capitalize">{size}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Mode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compact Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reduce spacing for a denser layout
              </p>
            </div>
          </div>
          <button
            onClick={() => setCompactMode(!compactMode)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              compactMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                compactMode ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preview
        </h3>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="text-xl font-bold mb-2" style={{ color: accentColor }}>
            Sample Heading
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is how your text will appear with the selected theme settings.
          </p>
          <button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
};
