import express from "express";
import { sendConfirmationEmail } from "../services/emailService";
import { z } from "zod";

const router = express.Router();

// Validation schema for email request
const sendConfirmationEmailSchema = z.object({
  email: z.string().email("Valid email address is required"),
  confirmationCode: z
    .string()
    .min(6, "Confirmation code must be at least 6 characters"),
  bookingDetails: z.object({
    propertyName: z.string().min(1, "Property name is required"),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    guestName: z.string().min(1, "Guest name is required"),
    totalPrice: z.string().min(1, "Total price is required"),
  }),
});

// POST /api/email/send-confirmation
router.post("/send-confirmation", async (req, res) => {
  try {
    // Validate request body
    const validatedData = sendConfirmationEmailSchema.parse(req.body);

    const { email, confirmationCode, bookingDetails } = validatedData;

    console.log(
      `📧 Sending confirmation email to: ${email} with code: ${confirmationCode}`,
    );

    // Send the email
    const result = await sendConfirmationEmail(
      email,
      confirmationCode,
      bookingDetails,
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Confirmation email sent successfully",
        messageId: result.messageId,
        previewUrl: result.previewUrl, // Only available in development
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send confirmation email",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ API Error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/email/test - Test endpoint to check email service
router.get("/test", async (req, res) => {
  try {
    const { testEmailConnection } = await import("../services/emailService");
    const isConnected = await testEmailConnection();

    res.status(200).json({
      success: true,
      message: isConnected
        ? "Email service is working"
        : "Email service connection failed",
      connected: isConnected,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to test email service",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
