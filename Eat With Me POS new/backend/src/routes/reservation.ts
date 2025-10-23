import { Router } from "express";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  searchReservations,
  checkAvailability
} from "../controllers/reservation";

const router = Router();

router.get("/", getAllReservations);
router.get("/search", searchReservations);
router.get("/availability", checkAvailability);
router.get("/:id", getReservationById);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export { router as reservationRoutes };
