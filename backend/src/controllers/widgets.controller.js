import WidgetLayout from '../models/WidgetLayout.js';

// Get user's widget layouts
export const getWidgetLayouts = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;

    const layouts = await WidgetLayout.findAll({
      where: { tenantId, userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: layouts,
    });
  } catch (error) {
    console.error('Get widget layouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch widget layouts',
      error: error.message,
    });
  }
};

// Get default layout
export const getDefaultLayout = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;

    let layout = await WidgetLayout.findOne({
      where: { tenantId, userId, isDefault: true },
    });

    // If no default, create one
    if (!layout) {
      layout = await WidgetLayout.create({
        tenantId,
        userId,
        name: 'Default Layout',
        isDefault: true,
        layout: {
          widgets: [
            { id: 'revenue', type: 'metric', position: { x: 0, y: 0, w: 3, h: 2 } },
            { id: 'orders', type: 'metric', position: { x: 3, y: 0, w: 3, h: 2 } },
            { id: 'customers', type: 'metric', position: { x: 6, y: 0, w: 3, h: 2 } },
            { id: 'inventory', type: 'metric', position: { x: 9, y: 0, w: 3, h: 2 } },
            { id: 'revenue-chart', type: 'chart', position: { x: 0, y: 2, w: 6, h: 4 } },
            { id: 'top-products', type: 'list', position: { x: 6, y: 2, w: 6, h: 4 } },
          ],
        },
      });
    }

    res.json({
      success: true,
      data: layout,
    });
  } catch (error) {
    console.error('Get default layout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch default layout',
      error: error.message,
    });
  }
};

// Create widget layout
export const createWidgetLayout = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { name, layout, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await WidgetLayout.update(
        { isDefault: false },
        { where: { tenantId, userId } }
      );
    }

    const widgetLayout = await WidgetLayout.create({
      tenantId,
      userId,
      name,
      layout,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: 'Widget layout created successfully',
      data: widgetLayout,
    });
  } catch (error) {
    console.error('Create widget layout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create widget layout',
      error: error.message,
    });
  }
};

// Update widget layout
export const updateWidgetLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: userId } = req.user;
    const { name, layout, isDefault } = req.body;

    const widgetLayout = await WidgetLayout.findOne({
      where: { id, tenantId, userId },
    });

    if (!widgetLayout) {
      return res.status(404).json({
        success: false,
        message: 'Widget layout not found',
      });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await WidgetLayout.update(
        { isDefault: false },
        { where: { tenantId, userId, id: { [Op.ne]: id } } }
      );
    }

    await widgetLayout.update({
      name: name || widgetLayout.name,
      layout: layout || widgetLayout.layout,
      isDefault: isDefault !== undefined ? isDefault : widgetLayout.isDefault,
    });

    res.json({
      success: true,
      message: 'Widget layout updated successfully',
      data: widgetLayout,
    });
  } catch (error) {
    console.error('Update widget layout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update widget layout',
      error: error.message,
    });
  }
};

// Delete widget layout
export const deleteWidgetLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: userId } = req.user;

    const widgetLayout = await WidgetLayout.findOne({
      where: { id, tenantId, userId },
    });

    if (!widgetLayout) {
      return res.status(404).json({
        success: false,
        message: 'Widget layout not found',
      });
    }

    // Don't allow deleting default layout
    if (widgetLayout.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default layout',
      });
    }

    await widgetLayout.destroy();

    res.json({
      success: true,
      message: 'Widget layout deleted successfully',
    });
  } catch (error) {
    console.error('Delete widget layout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete widget layout',
      error: error.message,
    });
  }
};

// Set default layout
export const setDefaultLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, id: userId } = req.user;

    const widgetLayout = await WidgetLayout.findOne({
      where: { id, tenantId, userId },
    });

    if (!widgetLayout) {
      return res.status(404).json({
        success: false,
        message: 'Widget layout not found',
      });
    }

    // Unset other defaults
    await WidgetLayout.update(
      { isDefault: false },
      { where: { tenantId, userId } }
    );

    // Set this as default
    await widgetLayout.update({ isDefault: true });

    res.json({
      success: true,
      message: 'Default layout set successfully',
      data: widgetLayout,
    });
  } catch (error) {
    console.error('Set default layout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default layout',
      error: error.message,
    });
  }
};
