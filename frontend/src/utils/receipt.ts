interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}

interface ReceiptData {
  saleNumber: string;
  date: Date;
  cashier: string;
  customer?: {
    name: string;
    phone?: string;
  };
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: string;
  branch?: {
    name: string;
    address?: string;
    phone?: string;
  };
}

/**
 * Generate formatted receipt text
 */
export const generateReceiptText = (data: ReceiptData): string => {
  const lines: string[] = [];
  const width = 48;

  // Helper functions
  const centerText = (text: string) => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  const rightAlign = (text: string, label: string) => {
    const space = width - label.length - text.length;
    return label + ' '.repeat(Math.max(1, space)) + text;
  };

  const line = () => '='.repeat(width);
  const dottedLine = () => '-'.repeat(width);

  // Header
  lines.push(line());
  lines.push(centerText('GROCERY STORE MANAGEMENT'));
  lines.push(centerText('SALES RECEIPT'));
  lines.push(line());

  // Branch info
  if (data.branch) {
    lines.push(centerText(data.branch.name));
    if (data.branch.address) {
      lines.push(centerText(data.branch.address));
    }
    if (data.branch.phone) {
      lines.push(centerText(`Tel: ${data.branch.phone}`));
    }
    lines.push(dottedLine());
  }

  // Receipt details
  lines.push(`Receipt #: ${data.saleNumber}`);
  lines.push(`Date: ${data.date.toLocaleString()}`);
  lines.push(`Cashier: ${data.cashier}`);
  if (data.customer) {
    lines.push(`Customer: ${data.customer.name}`);
    if (data.customer.phone) {
      lines.push(`Phone: ${data.customer.phone}`);
    }
  }
  lines.push(dottedLine());

  // Items header
  lines.push('Item                        Qty    Price    Total');
  lines.push(dottedLine());

  // Items
  data.items.forEach((item) => {
    // Item name (may wrap)
    const itemName = item.name.length > 28 ? item.name.substring(0, 25) + '...' : item.name;
    lines.push(itemName);

    // Quantity, price, total
    const qtyStr = item.quantity.toString();
    const priceStr = `KES ${item.price.toFixed(2)}`;
    const totalStr = `KES ${item.total.toFixed(2)}`;
    
    const detailLine = ' '.repeat(28) + 
      qtyStr.padStart(3) + ' '.repeat(2) +
      priceStr.padStart(11) + ' '.repeat(2) +
      totalStr.padStart(12);
    lines.push(detailLine);

    // Discount if applicable
    if (item.discount && item.discount > 0) {
      lines.push(`  (${item.discount}% discount applied)`);
    }
  });

  lines.push(dottedLine());

  // Totals
  lines.push(rightAlign(`KES ${data.subtotal.toFixed(2)}`, 'Subtotal:'));
  
  if (data.discount > 0) {
    lines.push(rightAlign(`-KES ${data.discount.toFixed(2)}`, 'Discount:'));
  }
  
  lines.push(rightAlign(`KES ${data.tax.toFixed(2)}`, 'Tax (16%):'));
  lines.push(dottedLine());
  lines.push(rightAlign(`KES ${data.total.toFixed(2)}`, 'TOTAL:'));
  lines.push(line());

  // Payment info
  lines.push(rightAlign(data.paymentMethod.toUpperCase(), 'Payment Method:'));
  lines.push(rightAlign(`KES ${data.amountPaid.toFixed(2)}`, 'Amount Paid:'));
  
  if (data.change > 0) {
    lines.push(rightAlign(`KES ${data.change.toFixed(2)}`, 'Change:'));
  }
  
  lines.push(line());

  // Footer
  lines.push('');
  lines.push(centerText('Thank you for your purchase!'));
  lines.push(centerText('Please come again'));
  lines.push('');
  lines.push(line());

  return lines.join('\n');
};

/**
 * Generate HTML receipt for printing
 */
export const generateReceiptHTML = (data: ReceiptData): string => {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">KES ${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">KES ${item.total.toFixed(2)}</td>
    </tr>
    ${item.discount ? `<tr><td colspan="4" style="padding: 4px 8px; font-size: 12px; color: #f97316; border-bottom: 1px solid #eee;">Discount: ${item.discount}%</td></tr>` : ''}
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${data.saleNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Courier New', monospace;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 30px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header h2 {
      margin: 5px 0;
      font-size: 16px;
      font-weight: normal;
    }
    .branch-info {
      text-align: center;
      border-bottom: 1px dashed #999;
      padding-bottom: 15px;
      margin-bottom: 15px;
      font-size: 14px;
    }
    .details {
      margin-bottom: 20px;
      font-size: 14px;
    }
    .details div {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      padding: 10px 8px;
      text-align: left;
      background: #f0f0f0;
      border-bottom: 2px solid #333;
      font-weight: bold;
    }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #333;
      padding-top: 15px;
    }
    .totals div {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 14px;
    }
    .totals .total-line {
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #333;
      padding-top: 10px;
      margin-top: 10px;
    }
    .payment-info {
      margin-top: 20px;
      border-top: 2px solid #333;
      padding-top: 15px;
    }
    .payment-info div {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #333;
      font-size: 14px;
    }
    .print-button {
      text-align: center;
      margin: 20px 0;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="print-button no-print">
    <button onclick="window.print()">🖨️ Print Receipt</button>
    <button onclick="window.close()" style="background: #6b7280; margin-left: 10px;">Close</button>
  </div>
  
  <div class="receipt">
    <div class="header">
      <h1>GROCERY STORE MANAGEMENT</h1>
      <h2>SALES RECEIPT</h2>
    </div>
    
    ${data.branch ? `
    <div class="branch-info">
      <div><strong>${data.branch.name}</strong></div>
      ${data.branch.address ? `<div>${data.branch.address}</div>` : ''}
      ${data.branch.phone ? `<div>Tel: ${data.branch.phone}</div>` : ''}
    </div>
    ` : ''}
    
    <div class="details">
      <div><strong>Receipt #:</strong> ${data.saleNumber}</div>
      <div><strong>Date:</strong> ${data.date.toLocaleString()}</div>
      <div><strong>Cashier:</strong> ${data.cashier}</div>
      ${data.customer ? `
        <div><strong>Customer:</strong> ${data.customer.name}</div>
        ${data.customer.phone ? `<div><strong>Phone:</strong> ${data.customer.phone}</div>` : ''}
      ` : ''}
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
    
    <div class="totals">
      <div>
        <span>Subtotal:</span>
        <span>KES ${data.subtotal.toFixed(2)}</span>
      </div>
      ${data.discount > 0 ? `
      <div style="color: #f97316;">
        <span>Discount:</span>
        <span>-KES ${data.discount.toFixed(2)}</span>
      </div>
      ` : ''}
      <div>
        <span>Tax (16%):</span>
        <span>KES ${data.tax.toFixed(2)}</span>
      </div>
      <div class="total-line">
        <span>TOTAL:</span>
        <span>KES ${data.total.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="payment-info">
      <div>
        <span><strong>Payment Method:</strong></span>
        <span>${data.paymentMethod.toUpperCase()}</span>
      </div>
      <div>
        <span><strong>Amount Paid:</strong></span>
        <span>KES ${data.amountPaid.toFixed(2)}</span>
      </div>
      ${data.change > 0 ? `
      <div style="font-size: 16px; font-weight: bold;">
        <span>Change:</span>
        <span>KES ${data.change.toFixed(2)}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p><strong>Thank you for your purchase!</strong></p>
      <p>Please come again</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Print receipt in new window
 */
export const printReceipt = (data: ReceiptData) => {
  const receiptHTML = generateReceiptHTML(data);
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  }
};

/**
 * Download receipt as text file
 */
export const downloadReceiptText = (data: ReceiptData) => {
  const receiptText = generateReceiptText(data);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${data.saleNumber}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
