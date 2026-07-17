export type CommandCategory = 
  | 'navigation' 
  | 'actions' 
  | 'search' 
  | 'create' 
  | 'settings' 
  | 'reports'
  | 'branch';

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void | Promise<void>;
  shortcut?: string;
  group?: string;
  permission?: string;
}

export interface CommandGroup {
  title: string;
  commands: Command[];
}
