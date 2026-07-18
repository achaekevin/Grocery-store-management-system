'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
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
      branch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      order_type: {
        type: Sequelize.ENUM('sale', 'return', 'exchange'),
        defaultValue: 'sale',
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded'),
        defaultValue: 'completed',
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      paid_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      change_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'card', 'mpesa', 'bank_transfer', 'split'),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'partial', 'refunded'),
        defaultValue: 'paid',
      },
      notes: {
        type: Sequelize.TEXT,
      },
      completed_at: {
        type: Sequelize.DATE,
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

    // Order Items
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('orders', ['tenant_id']);
    await queryInterface.addIndex('orders', ['order_number'], { unique: true });
    await queryInterface.addIndex('orders', ['branch_id']);
    await queryInterface.addIndex('orders', ['customer_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['created_at']);
    await queryInterface.addIndex('order_items', ['order_id']);
    await queryInterface.addIndex('order_items', ['product_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
  },
};
