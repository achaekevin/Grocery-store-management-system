import apiService from './api';

export interface WidgetLayout {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  isDefault: boolean;
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; w: number; h: number };
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WidgetLayoutsResponse {
  success: boolean;
  data: WidgetLayout[];
}

export interface WidgetLayoutResponse {
  success: boolean;
  data: WidgetLayout;
}

export const widgetsApi = {
  // Get all widget layouts
  getWidgetLayouts: () => {
    return apiService.get<WidgetLayoutsResponse>('/v1/widgets');
  },

  // Get default layout
  getDefaultLayout: () => {
    return apiService.get<WidgetLayoutResponse>('/v1/widgets/default');
  },

  // Create widget layout
  createWidgetLayout: (data: { name: string; layout: any; isDefault?: boolean }) => {
    return apiService.post<WidgetLayoutResponse>('/v1/widgets', data);
  },

  // Update widget layout
  updateWidgetLayout: (id: string, data: Partial<WidgetLayout>) => {
    return apiService.put<WidgetLayoutResponse>(`/v1/widgets/${id}`, data);
  },

  // Set default layout
  setDefaultLayout: (id: string) => {
    return apiService.patch<WidgetLayoutResponse>(`/v1/widgets/${id}/default`);
  },

  // Delete widget layout
  deleteWidgetLayout: (id: string) => {
    return apiService.delete(`/v1/widgets/${id}`);
  },
};

export default widgetsApi;
