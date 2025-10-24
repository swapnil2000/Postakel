
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email',
  joinDate: 'joinDate',
  loyaltyPoints: 'loyaltyPoints',
  totalSpent: 'totalSpent'
};

exports.Prisma.StaffScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  phone: 'phone',
  email: 'email',
  pin: 'pin',
  salary: 'salary',
  isActive: 'isActive',
  joinDate: 'joinDate'
};

exports.Prisma.MenuItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  category: 'category',
  description: 'description',
  available: 'available',
  isVeg: 'isVeg',
  spiceLevel: 'spiceLevel',
  cookingTime: 'cookingTime',
  isPopular: 'isPopular',
  allergens: 'allergens',
  calories: 'calories',
  protein: 'protein',
  carbs: 'carbs',
  fat: 'fat',
  rating: 'rating'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  tableId: 'tableId',
  orderSource: 'orderSource',
  status: 'status',
  totalAmount: 'totalAmount',
  orderTime: 'orderTime',
  customerId: 'customerId',
  paymentMethod: 'paymentMethod'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  menuItemId: 'menuItemId',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.TableScalarFieldEnum = {
  id: 'id',
  number: 'number',
  status: 'status',
  capacity: 'capacity'
};

exports.Prisma.ReservationScalarFieldEnum = {
  id: 'id',
  tableId: 'tableId',
  customerId: 'customerId',
  date: 'date',
  time: 'time',
  partySize: 'partySize',
  status: 'status'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  category: 'category',
  unit: 'unit',
  currentStock: 'currentStock',
  minStock: 'minStock',
  maxStock: 'maxStock',
  costPerUnit: 'costPerUnit',
  supplierId: 'supplierId',
  expiryDate: 'expiryDate'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email',
  status: 'status'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  category: 'category',
  amount: 'amount',
  vendor: 'vendor',
  paymentMethod: 'paymentMethod',
  date: 'date',
  status: 'status'
};

exports.Prisma.LoyaltyLogScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  points: 'points',
  action: 'action',
  date: 'date'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Customer: 'Customer',
  Staff: 'Staff',
  MenuItem: 'MenuItem',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Table: 'Table',
  Reservation: 'Reservation',
  InventoryItem: 'InventoryItem',
  Supplier: 'Supplier',
  Expense: 'Expense',
  LoyaltyLog: 'LoyaltyLog'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
