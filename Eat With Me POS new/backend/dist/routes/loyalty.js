"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loyaltyRoutes = void 0;
const express_1 = require("express");
const loyalty_1 = require("../controllers/loyalty");
const router = (0, express_1.Router)();
exports.loyaltyRoutes = router;
router.get("/", loyalty_1.getAllLoyaltyLogs);
router.get("/:id", loyalty_1.getCustomerLoyaltyLog);
router.post("/:id", loyalty_1.addLoyaltyLog);
//# sourceMappingURL=loyalty.js.map