const express = require("express");
const {
  createBooking,
  getBookingDetails,
  updateBookingStatus,
  cancelBookingStatus,
} = require("../controllers/bookingController");
const { verifyUserAuth } = require("../middlewares/userAuth");

const router = express.Router();

router.post("/booking", verifyUserAuth, createBooking);
router.get("/booking/:id", verifyUserAuth, getBookingDetails);
router.patch("/booking/:id", verifyUserAuth, updateBookingStatus);
router.post("/booking/:id", verifyUserAuth, cancelBookingStatus);

module.exports = router;
