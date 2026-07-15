// ============ GROCERYOS MASTER DATA STORE ============
const BRANCHES = [
  { id:1, name:'Main Branch – Westlands', short:'Main Branch', city:'Nairobi', phone:'+254700111000', address:'Westlands Shopping Centre, Nairobi', revenue:2450000, expenses:890000, products:1234, employees:24, status:'active', manager:'Mary Wanjiku' },
  { id:2, name:'CBD Branch', short:'CBD Branch', city:'Nairobi', phone:'+254700222000', address:'Tom Mboya Street, Nairobi CBD', revenue:1870000, expenses:650000, products:987, employees:18, status:'active', manager:'James Mwangi' },
  { id:3, name:'Mombasa Road Branch', short:'Mombasa Rd', city:'Nairobi', phone:'+254700333000', address:'Enterprise Road, Industrial Area, Nairobi', revenue:1340000, expenses:510000, products:876, employees:15, status:'active', manager:'Sarah Njoroge' },
  { id:4, name:'Kisumu Branch', short:'Kisumu', city:'Kisumu', phone:'+254700444000', address:'Oginga Odinga Street, Kisumu', revenue:980000, expenses:340000, products:654, employees:12, status:'active', manager:'Peter Kamau' },
];
const CATEGORIES = ['Dairy','Bakery','Beverages','Fresh Produce','Snacks','Meat & Fish','Household','Personal Care','Frozen Foods','Pantry'];
const BRANDS = ['Brookside','Bidco','Unga','Supa Loaf','Coca-Cola','Pepsi','Keringet','Kenchic','Farmers Choice','Ariel','Omo','Pringles','Delmonte','Vaseline','Daima','Mumias','Own Brand'];
const UNITS = ['Piece','kg','g','Litre','ml','Pack','Box','Dozen','Tray','Bag','Bundle','Carton'];
const PRODUCTS = [
  { id:1,  name:'Fresh Whole Milk 1L',      sku:'MLK-001', barcode:'6001234567890', category:'Dairy',         brand:'Brookside',      unit:'Litre',  cost:65,  price:85,  qty:234, expiry:'2025-08-15', reorder:50,  image:'🥛', taxable:true  },
  { id:2,  name:'White Sliced Bread',       sku:'BRD-001', barcode:'6001234567891', category:'Bakery',        brand:'Supa Loaf',      unit:'Loaf',   cost:48,  price:65,  qty:87,  expiry:'2025-07-25', reorder:30,  image:'🍞', taxable:false },
  { id:3,  name:'Coca-Cola 500ml',          sku:'BVG-001', barcode:'6001234567892', category:'Beverages',     brand:'Coca-Cola',      unit:'Bottle', cost:55,  price:80,  qty:312, expiry:'2026-03-10', reorder:100, image:'🥤', taxable:true  },
  { id:4,  name:'Tomatoes 1kg',             sku:'FP-001',  barcode:'6001234567893', category:'Fresh Produce', brand:'Farm Fresh',     unit:'kg',     cost:40,  price:65,  qty:12,  expiry:'2025-07-22', reorder:20,  image:'🍅', taxable:false },
  { id:5,  name:'Crisps 100g',              sku:'SNK-001', barcode:'6001234567894', category:'Snacks',        brand:'Pringles',       unit:'Pack',   cost:90,  price:130, qty:145, expiry:'2026-01-15', reorder:40,  image:'🍟', taxable:true  },
  { id:6,  name:'Chicken Breast 500g',      sku:'MT-001',  barcode:'6001234567895', category:'Meat & Fish',   brand:'Farmers Choice', unit:'Pack',   cost:280, price:380, qty:34,  expiry:'2025-07-23', reorder:20,  image:'🍗', taxable:false },
  { id:7,  name:'Detergent Powder 1kg',     sku:'HH-001',  barcode:'6001234567896', category:'Household',     brand:'Ariel',          unit:'Pack',   cost:310, price:420, qty:67,  expiry:'2027-05-01', reorder:25,  image:'🧴', taxable:true  },
  { id:8,  name:'Strawberry Yoghurt 400ml', sku:'MLK-002', barcode:'6001234567897', category:'Dairy',         brand:'Brookside',      unit:'Cup',    cost:75,  price:100, qty:89,  expiry:'2025-07-28', reorder:30,  image:'🫙', taxable:true  },
  { id:9,  name:'Eggs (Tray 30)',           sku:'EG-001',  barcode:'6001234567898', category:'Dairy',         brand:'Kenchic',        unit:'Tray',   cost:410, price:540, qty:28,  expiry:'2025-08-01', reorder:15,  image:'🥚', taxable:false },
  { id:10, name:'Mineral Water 500ml',      sku:'BVG-002', barcode:'6001234567899', category:'Beverages',     brand:'Keringet',       unit:'Bottle', cost:28,  price:45,  qty:456, expiry:'2027-01-01', reorder:100, image:'💧', taxable:false },
  { id:11, name:'Sugar 1kg',               sku:'PNT-001', barcode:'6001234567900', category:'Pantry',        brand:'Mumias',         unit:'Pack',   cost:130, price:165, qty:189, expiry:'2027-06-01', reorder:50,  image:'🍚', taxable:false },
  { id:12, name:'Cooking Oil 1L',          sku:'PNT-002', barcode:'6001234567901', category:'Pantry',        brand:'Bidco',          unit:'Bottle', cost:210, price:280, qty:78,  expiry:'2026-09-01', reorder:30,  image:'🫙', taxable:true  },
  { id:13, name:'Maize Flour 2kg',         sku:'PNT-003', barcode:'6001234567902', category:'Pantry',        brand:'Unga',           unit:'Pack',   cost:145, price:185, qty:234, expiry:'2026-12-01', reorder:60,  image:'🌽', taxable:false },
  { id:14, name:'Mango Juice 500ml',       sku:'BVG-003', barcode:'6001234567903', category:'Beverages',     brand:'Delmonte',       unit:'Bottle', cost:70,  price:95,  qty:167, expiry:'2026-02-01', reorder:50,  image:'🧃', taxable:true  },
  { id:15, name:'Body Lotion 400ml',       sku:'PC-001',  barcode:'6001234567904', category:'Personal Care', brand:'Vaseline',       unit:'Bottle', cost:180, price:250, qty:54,  expiry:'2028-01-01', reorder:20,  image:'🧴', taxable:true  },
  { id:16, name:'Frozen Peas 500g',        sku:'FRZ-001', barcode:'6001234567905', category:'Frozen Foods',  brand:'Own Brand',      unit:'Pack',   cost:120, price:170, qty:45,  expiry:'2026-06-01', reorder:20,  image:'🫛', taxable:true  },
  { id:17, name:'Spaghetti 500g',          sku:'PNT-004', barcode:'6001234567906', category:'Pantry',        brand:'Barilla',        unit:'Pack',   cost:95,  price:130, qty:112, expiry:'2027-03-01', reorder:30,  image:'🍝', taxable:true  },
  { id:18, name:'Cheddar Cheese 200g',     sku:'MLK-003', barcode:'6001234567907', category:'Dairy',         brand:'Daima',          unit:'Pack',   cost:280, price:380, qty:23,  expiry:'2025-08-20', reorder:15,  image:'🧀', taxable:true  },
  { id:19, name:'Washing Up Liquid 500ml', sku:'HH-002',  barcode:'6001234567908', category:'Household',     brand:'Omo',            unit:'Bottle', cost:120, price:170, qty:89,  expiry:'2028-03-01', reorder:30,  image:'🫧', taxable:true  },
  { id:20, name:'Basmati Rice 2kg',        sku:'PNT-005', barcode:'6001234567909', category:'Pantry',        brand:'Own Brand',      unit:'Pack',   cost:280, price:380, qty:67,  expiry:'2027-01-01', reorder:25,  image:'🍚', taxable:false },
];
const CUSTOMERS = [
  { id:1, name:'Alice Wanjiku',     phone:'+254722123456', email:'alice@email.com',    points:2450, tier:'Gold',     purchases:156, total:284500, since:'2022-03-15', balance:0    },
  { id:2, name:'Brian Otieno',      phone:'+254733234567', email:'brian@email.com',    points:890,  tier:'Silver',   purchases:78,  total:98700,  since:'2023-01-20', balance:1500 },
  { id:3, name:'Catherine Muthoni', phone:'+254712345678', email:'cathy@email.com',    points:4200, tier:'Platinum', purchases:234, total:567800, since:'2021-08-10', balance:0    },
  { id:4, name:'Daniel Kipchoge',   phone:'+254700456789', email:'dan@email.com',      points:120,  tier:'Bronze',   purchases:23,  total:18900,  since:'2024-02-05', balance:500  },
  { id:5, name:'Esther Achieng',    phone:'+254711567890', email:'esther@email.com',   points:1780, tier:'Silver',   purchases:94,  total:134500, since:'2022-11-30', balance:0    },
  { id:6, name:'Francis Mutua',     phone:'+254722678901', email:'francis@email.com',  points:340,  tier:'Bronze',   purchases:41,  total:45600,  since:'2023-07-12', balance:2000 },
  { id:7, name:'Grace Njeri',       phone:'+254733789012', email:'grace.n@email.com',  points:5100, tier:'Platinum', purchases:289, total:723400, since:'2021-01-05', balance:0    },
  { id:8, name:'Hassan Omar',       phone:'+254700890123', email:'hassan@email.com',   points:670,  tier:'Silver',   purchases:56,  total:78200,  since:'2023-04-18', balance:0    },
];
const SUPPLIERS = [
  { id:1, name:'Brookside Dairy Ltd',       contact:'James Mwangi',  phone:'+254700111222', email:'orders@brookside.co.ke',  products:45, outstanding:234500, lastOrder:'2025-07-18', status:'active', terms:'Net 30', address:'Ruiru, Kiambu County' },
  { id:2, name:'East African Breweries',    contact:'Sarah Njoroge', phone:'+254711333444', email:'trade@eabl.com',           products:23, outstanding:0,      lastOrder:'2025-07-15', status:'active', terms:'COD',    address:'Ruaraka, Nairobi' },
  { id:3, name:'Bidco Africa Ltd',          contact:'Peter Kamau',   phone:'+254722555666', email:'orders@bidco.co.ke',       products:67, outstanding:89000,  lastOrder:'2025-07-20', status:'active', terms:'Net 14', address:'Thika Road, Nairobi' },
  { id:4, name:'Unga Group PLC',            contact:'Mary Wambua',   phone:'+254733777888', email:'sales@unga.co.ke',         products:34, outstanding:45600,  lastOrder:'2025-07-12', status:'active', terms:'Net 30', address:'Industrial Area, Nairobi' },
  { id:5, name:'Kenchic Ltd',               contact:'Tom Odhiambo',  phone:'+254700888999', email:'orders@kenchic.com',       products:18, outstanding:12000,  lastOrder:'2025-07-19', status:'active', terms:'COD',    address:'Athi River, Machakos' },
];
const USERS_LIST = [
  { id:1, name:'John Kariuki',   email:'john@groceryos.co.ke',  role:'Super Admin',     branch:'All Branches', status:'active',   lastLogin:'2025-07-21 09:34', phone:'+254700000001' },
  { id:2, name:'Mary Wanjiku',   email:'mary@groceryos.co.ke',  role:'Branch Manager',  branch:'Main Branch',  status:'active',   lastLogin:'2025-07-21 08:12', phone:'+254700000002' },
  { id:3, name:'Peter Otieno',   email:'peter@groceryos.co.ke', role:'Cashier',         branch:'CBD Branch',   status:'active',   lastLogin:'2025-07-21 10:00', phone:'+254700000003' },
  { id:4, name:'Grace Muthoni',  email:'grace@groceryos.co.ke', role:'Inventory Clerk', branch:'Main Branch',  status:'active',   lastLogin:'2025-07-20 15:45', phone:'+254700000004' },
  { id:5, name:'Sam Kipkoech',   email:'sam@groceryos.co.ke',   role:'Accountant',      branch:'All Branches', status:'inactive', lastLogin:'2025-07-18 11:30', phone:'+254700000005' },
  { id:6, name:'Jane Odhiambo',  email:'jane@groceryos.co.ke',  role:'Cashier',         branch:'Main Branch',  status:'active',   lastLogin:'2025-07-21 09:00', phone:'+254700000006' },
];
const PURCHASE_ORDERS = [
  { id:'PO-2025-0089', supplier:'Brookside Dairy Ltd',    items:8,  amount:234500, status:'Delivered', date:'2025-07-18', branch:'Main Branch',     received:true  },
  { id:'PO-2025-0088', supplier:'Bidco Africa Ltd',       items:15, amount:389000, status:'Pending',   date:'2025-07-20', branch:'CBD Branch',      received:false },
  { id:'PO-2025-0087', supplier:'Unga Group PLC',         items:12, amount:178000, status:'Approved',  date:'2025-07-19', branch:'Main Branch',     received:false },
  { id:'PO-2025-0086', supplier:'East African Breweries', items:5,  amount:67500,  status:'Cancelled', date:'2025-07-17', branch:'Kisumu Branch',   received:false },
  { id:'PO-2025-0085', supplier:'Kenchic Ltd',            items:10, amount:145000, status:'Delivered', date:'2025-07-15', branch:'Main Branch',     received:true  },
];
const MPESA_TRANSACTIONS = [
  { id:'MPE-001', ref:'QH7R2J1K8X', phone:'+254722123456', amount:1250,  status:'Success', time:'2025-07-21 10:12:34', type:'STK Push', sale:'SAL-1001' },
  { id:'MPE-002', ref:'QH7R2J1K9Y', phone:'+254711234567', amount:4500,  status:'Success', time:'2025-07-21 09:45:12', type:'STK Push', sale:'SAL-1002' },
  { id:'MPE-003', ref:'QH7R2J1KAZ', phone:'+254700345678', amount:890,   status:'Pending', time:'2025-07-21 09:30:00', type:'STK Push', sale:'SAL-1003' },
  { id:'MPE-004', ref:'QH7R2J1KBW', phone:'+254733456789', amount:2100,  status:'Failed',  time:'2025-07-21 09:15:22', type:'STK Push', sale:'SAL-1004' },
  { id:'MPE-005', ref:'QH7R2J1KCV', phone:'+254722567890', amount:3750,  status:'Success', time:'2025-07-21 08:50:45', type:'STK Push', sale:'SAL-1005' },
  { id:'MPE-006', ref:'QH7R2J1KDU', phone:'+254700678901', amount:12000, status:'Success', time:'2025-07-20 17:22:10', type:'STK Push', sale:'SAL-0998' },
];
const EXPENSES = [
  { id:1, date:'2025-07-21', category:'Rent',        branch:'Main Branch',   desc:'Monthly rent – July 2025',       amount:85000,  approved:true,  approvedBy:'John Kariuki',  receipt:true  },
  { id:2, date:'2025-07-20', category:'Utilities',   branch:'CBD Branch',    desc:'Kenya Power electricity bill',   amount:12400,  approved:true,  approvedBy:'Mary Wanjiku',  receipt:true  },
  { id:3, date:'2025-07-20', category:'Staff',       branch:'Main Branch',   desc:'Casual labour – weekend shift',  amount:8500,   approved:false, approvedBy:null,            receipt:false },
  { id:4, date:'2025-07-19', category:'Transport',   branch:'Kisumu Branch', desc:'Delivery vehicle fuel',          amount:4200,   approved:true,  approvedBy:'Peter Kamau',   receipt:true  },
  { id:5, date:'2025-07-18', category:'Maintenance', branch:'Main Branch',   desc:'Walk-in freezer service',        amount:15000,  approved:true,  approvedBy:'John Kariuki',  receipt:true  },
  { id:6, date:'2025-07-17', category:'Marketing',   branch:'All Branches',  desc:'Radio advertisement – QFM',      amount:45000,  approved:true,  approvedBy:'John Kariuki',  receipt:false },
  { id:7, date:'2025-07-16', category:'Utilities',   branch:'Main Branch',   desc:'Nairobi City Water bill',        amount:3400,   approved:false, approvedBy:null,            receipt:true  },
  { id:8, date:'2025-07-15', category:'Staff',       branch:'CBD Branch',    desc:'Staff uniform allowance',        amount:22000,  approved:true,  approvedBy:'Mary Wanjiku',  receipt:false },
];
const AUDIT_LOGS = [
  { id:1,  user:'John Kariuki',  action:'User Login',                module:'Auth',      timestamp:'2025-07-21 09:34:12', ip:'196.201.214.5'  },
  { id:2,  user:'Mary Wanjiku',  action:'Created Product MLK-003',   module:'Products',  timestamp:'2025-07-21 08:45:23', ip:'196.201.214.8'  },
  { id:3,  user:'Peter Otieno',  action:'Processed Sale KSh 4,250',  module:'POS',       timestamp:'2025-07-21 10:12:45', ip:'196.201.214.12' },
  { id:4,  user:'Grace Muthoni', action:'Stock Adjustment -3 units', module:'Inventory', timestamp:'2025-07-21 09:02:11', ip:'196.201.214.15' },
  { id:5,  user:'John Kariuki',  action:'Added User Jane Odhiambo',  module:'Users',     timestamp:'2025-07-20 16:23:44', ip:'196.201.214.5'  },
  { id:6,  user:'Mary Wanjiku',  action:'Branch Settings Updated',   module:'Settings',  timestamp:'2025-07-20 14:11:02', ip:'196.201.214.8'  },
  { id:7,  user:'Sam Kipkoech',  action:'Generated P&L Report',      module:'Finance',   timestamp:'2025-07-20 11:45:00', ip:'196.201.214.20' },
  { id:8,  user:'Peter Otieno',  action:'Voided Sale SAL-0990',      module:'POS',       timestamp:'2025-07-20 10:30:55', ip:'196.201.214.12' },
  { id:9,  user:'Grace Muthoni', action:'Transfer 50 units to CBD',  module:'Inventory', timestamp:'2025-07-19 15:22:08', ip:'196.201.214.15' },
  { id:10, user:'John Kariuki',  action:'Deleted Expired Product',   module:'Products',  timestamp:'2025-07-19 09:10:33', ip:'196.201.214.5'  },
  { id:11, user:'Mary Wanjiku',  action:'Approved PO-2025-0087',     module:'Purchases', timestamp:'2025-07-19 08:55:17', ip:'196.201.214.8'  },
  { id:12, user:'Jane Odhiambo', action:'Processed Sale KSh 1,890',  module:'POS',       timestamp:'2025-07-21 10:45:00', ip:'196.201.214.22' },
];
const NOTIFICATIONS = [
  { id:1, type:'danger',  title:'Low Stock Alert',        body:'Tomatoes 1kg — only 12 units left (reorder level: 20)',       time:'5 min ago',  read:false },
  { id:2, type:'warning', title:'Expiry Alert',            body:'Chicken Breast 500g expires in 2 days (23 Jul 2025)',         time:'1 hr ago',   read:false },
  { id:3, type:'success', title:'M-Pesa Payment Received', body:'STK Push KSh 4,500 confirmed — Ref: QH7R2J1K9Y',             time:'2 hrs ago',  read:true  },
  { id:4, type:'info',    title:'New Purchase Order',      body:'PO-2025-0088 from Bidco Africa awaiting approval',            time:'3 hrs ago',  read:true  },
  { id:5, type:'danger',  title:'Out of Stock',            body:'White Sliced Bread at CBD Branch — 0 units remaining',       time:'4 hrs ago',  read:true  },
  { id:6, type:'warning', title:'Expiry Alert',            body:'Strawberry Yoghurt 400ml expires 28 Jul 2025',               time:'5 hrs ago',  read:false },
  { id:7, type:'success', title:'PO Delivered',            body:'PO-2025-0089 from Brookside Dairy received & verified',      time:'6 hrs ago',  read:true  },
];
const SALES_HISTORY = Array.from({length:25},(_,i)=>({
  id:`SAL-2025-${(1000+i).toString()}`,
  date:`2025-07-${(21-Math.floor(i/5)).toString().padStart(2,'0')}`,
  time:`${(8+i%12).toString().padStart(2,'0')}:${(10+i*7%60).toString().padStart(2,'0')}`,
  cashier:['Peter Otieno','Mary Wanjiku','Grace Muthoni','Jane Odhiambo'][i%4],
  branch:['Main Branch','CBD Branch','Main Branch','Kisumu Branch'][i%4],
  items:Math.floor(3+((i*7)%12)),
  amount:Math.floor(500+(i*1337)%9000),
  payment:['Cash','M-Pesa','Card','Cash','M-Pesa'][i%5],
  status:i===3?'Voided':i===7?'Refunded':'Completed',
  customer:i%3===0?CUSTOMERS[i%8].name:'Walk-in',
}));
const STOCK_MOVEMENTS = [
  { id:1, type:'Stock In',     product:'Fresh Whole Milk 1L',   qty:100,  date:'2025-07-15', ref:'PO-2025-0085', branch:'Main Branch', by:'Grace Muthoni' },
  { id:2, type:'Sale',         product:'Coca-Cola 500ml',        qty:-12,  date:'2025-07-21', ref:'SAL-2025-1003',branch:'Main Branch', by:'Peter Otieno'  },
  { id:3, type:'Adjustment',   product:'Tomatoes 1kg',           qty:-3,   date:'2025-07-20', ref:'ADJ-001',       branch:'Main Branch', by:'Grace Muthoni' },
  { id:4, type:'Transfer Out', product:'Detergent Powder 1kg',   qty:-20,  date:'2025-07-19', ref:'TRF-001',       branch:'Main Branch', by:'Mary Wanjiku'  },
  { id:5, type:'Transfer In',  product:'Detergent Powder 1kg',   qty:20,   date:'2025-07-19', ref:'TRF-001',       branch:'CBD Branch',  by:'Mary Wanjiku'  },
  { id:6, type:'Damaged',      product:'Fresh Whole Milk 1L',    qty:-8,   date:'2025-07-20', ref:'DMG-001',       branch:'Main Branch', by:'Grace Muthoni' },
  { id:7, type:'Stock In',     product:'Sugar 1kg',              qty:200,  date:'2025-07-14', ref:'PO-2025-0083', branch:'Main Branch', by:'Grace Muthoni' },
  { id:8, type:'Expired',      product:'Chicken Breast 500g',    qty:-5,   date:'2025-07-18', ref:'EXP-001',       branch:'CBD Branch',  by:'James Mwangi'  },
];
const DAILY_SALES = [
  {day:'Mon',sales:187400,orders:212},{day:'Tue',sales:143200,orders:178},
  {day:'Wed',sales:234500,orders:289},{day:'Thu',sales:198000,orders:244},
  {day:'Fri',sales:312000,orders:387},{day:'Sat',sales:445000,orders:512},
  {day:'Sun',sales:389000,orders:456},
];
const MONTHLY_SALES = [
  {month:'Jan',revenue:4200000,expenses:1800000},{month:'Feb',revenue:3900000,expenses:1650000},
  {month:'Mar',revenue:4800000,expenses:1950000},{month:'Apr',revenue:5100000,expenses:2100000},
  {month:'May',revenue:4600000,expenses:1900000},{month:'Jun',revenue:5400000,expenses:2200000},
  {month:'Jul',revenue:8400000,expenses:3200000},{month:'Aug',revenue:6100000,expenses:2400000},
  {month:'Sep',revenue:5800000,expenses:2300000},{month:'Oct',revenue:6400000,expenses:2500000},
  {month:'Nov',revenue:7200000,expenses:2800000},{month:'Dec',revenue:9100000,expenses:3500000},
];
const TOP_PRODUCTS = [
  {name:'Milk 1L',sales:2345,revenue:199325},{name:'Bread',sales:1890,revenue:122850},
  {name:'Water 500ml',sales:1654,revenue:74430},{name:'Coke 500ml',sales:1432,revenue:114560},
  {name:'Eggs Tray',sales:1298,revenue:700920},{name:'Sugar 1kg',sales:1124,revenue:185460},
];
const CATEGORY_PERF = [
  {name:'Dairy',value:28},{name:'Beverages',value:22},{name:'Bakery',value:18},
  {name:'Fresh Produce',value:15},{name:'Pantry',value:12},{name:'Other',value:5},
];
const ROLES_DATA = [
  { name:'Super Admin',    desc:'Full access to all modules and branches', color:'var(--accent)'   },
  { name:'Branch Manager', desc:'Manage assigned branch operations',        color:'var(--success)'  },
  { name:'Cashier',        desc:'POS transactions and daily sales',         color:'var(--info)'     },
  { name:'Inventory Clerk',desc:'Product and stock management',             color:'var(--warning)'  },
  { name:'Accountant',     desc:'Financial reports and expense tracking',   color:'var(--purple)'   },
];
const TRANSFERS = [
  { id:'TRF-001', from:'Main Branch', to:'CBD Branch',      product:'Detergent Powder 1kg',  qty:20, date:'2025-07-19', status:'Completed',  by:'Mary Wanjiku'  },
  { id:'TRF-002', from:'Main Branch', to:'Kisumu Branch',   product:'Sugar 1kg',              qty:50, date:'2025-07-18', status:'In Transit',  by:'John Kariuki'  },
  { id:'TRF-003', from:'CBD Branch',  to:'Main Branch',     product:'Crisps 100g',            qty:20, date:'2025-07-17', status:'Completed',  by:'Grace Muthoni' },
  { id:'TRF-004', from:'Main Branch', to:'Mombasa Rd Branch',product:'Cooking Oil 1L',        qty:30, date:'2025-07-16', status:'Completed',  by:'Mary Wanjiku'  },
];
const DAMAGED_GOODS = [
  { id:1, product:'Fresh Whole Milk 1L',    qty:8,  value:680,  date:'2025-07-20', branch:'Main Branch',  reason:'Dropped during stocking',     status:'Written Off' },
  { id:2, product:'Tomatoes 1kg',           qty:5,  value:325,  date:'2025-07-19', branch:'CBD Branch',   reason:'Near expiry – unsaleable',     status:'Pending'     },
  { id:3, product:'Strawberry Yoghurt 400ml',qty:3, value:300,  date:'2025-07-18', branch:'Main Branch',  reason:'Fridge malfunction',           status:'Written Off' },
  { id:4, product:'Mango Juice 500ml',      qty:12, value:1140, date:'2025-07-16', branch:'Kisumu Branch',reason:'Delivery truck damaged carton', status:'Claimed'     },
];
const CASH_FLOW = [
  {month:'Jan',inflow:4200000,outflow:1800000},{month:'Feb',inflow:3900000,outflow:1650000},
  {month:'Mar',inflow:4800000,outflow:1950000},{month:'Apr',inflow:5100000,outflow:2100000},
  {month:'May',inflow:4600000,outflow:1900000},{month:'Jun',inflow:5400000,outflow:2200000},
  {month:'Jul',inflow:8400000,outflow:3200000},
];
const INCOME_SOURCES = [
  {source:'Product Sales',amount:8100000,pct:96.4},
  {source:'Delivery Fees',amount:145000,pct:1.7},
  {source:'Loyalty Redemptions',amount:-89000,pct:-1.1},
  {source:'Other Income',amount:155000,pct:1.8},
  {source:'Wastage Write-offs',amount:-12400,pct:-0.1},
];
window.D = { BRANCHES,CATEGORIES,BRANDS,UNITS,PRODUCTS,CUSTOMERS,SUPPLIERS,USERS_LIST,PURCHASE_ORDERS,MPESA_TRANSACTIONS,EXPENSES,AUDIT_LOGS,NOTIFICATIONS,SALES_HISTORY,STOCK_MOVEMENTS,DAILY_SALES,MONTHLY_SALES,TOP_PRODUCTS,CATEGORY_PERF,ROLES_DATA,TRANSFERS,DAMAGED_GOODS,CASH_FLOW,INCOME_SOURCES };
