'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      supplier_id: {
        type: Sequelize.UUID,
        references: {
          model: 'suppliers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      barcode: {
        type: Sequelize.STRING,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING,
      },
      images: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      unit: {
        type: Sequelize.STRING,
        defaultValue: 'pcs',
      },
      purchase_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      selling_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      wholesale_price: {
        type: Sequelize.DECIMAL(15, 2),
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      },
      min_stock_level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      max_stock_level: {
        type: Sequelize.INTEGER,
      },
      reorder_level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expiry_alert_days: {
        type: Sequelize.INTEGER,
        defaultValue: 30,
      },
      has_variants: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      track_stock: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      meta: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('products', ['tenant_id', 'sku'], { unique: true });
    await queryInterface.addIndex('products', ['barcode']);
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['supplier_id']);
    await queryInterface.addIndex('products', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
