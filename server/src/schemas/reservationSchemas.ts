import { z } from "zod";

export const createReservationSchema = z.object({
  hotelId: z.string().min(1),
  roomType: z.string().min(1),
  roomName: z.string().min(1),
  roomId: z.string().min(1),
  quantity: z.number().int().positive(),

  guests: z.object({
    adults: z.number().int().positive(),
    children: z.number().int().min(0).default(0),
  }),

  checkIn: z.union([z.string(), z.date()]),
  checkOut: z.union([z.string(), z.date()]),

  guestInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    country: z.string().optional(),
    specialRequests: z.string().optional(),
    dietaryRequirements: z.string().optional(),
    arrivalTime: z.string().optional(),
    departureTime: z.string().optional(),
  }),

  children: z
    .array(
      z.object({
        name: z.string().optional(),
        age: z.number().int().positive(),
        needsCot: z.boolean().default(false),
      })
    )
    .optional(),

  specialRequests: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
        additionalCost: z.number().min(0).default(0),
      })
    )
    .optional(),

  sharedWith: z.array(z.string()).optional(),

  payment: z
    .object({
      method: z
        .enum([
          "NONE",
          "CASH",
          "CARD",
          "PAYPAL",
          "AMERICAN_EXPRESS",
          "VISA",
          "MASTERCARD",
          "JCB",
          "MAESTRO",
          "DISCOVER",
          "UNIONPAY",
        ])
        .default("NONE"),
      paid: z.boolean().default(false),
      transactionId: z.string().optional(),
    })
    .optional(),

  policies: z
    .object({
      freeCancellation: z.boolean().default(true),
      noPrepayment: z.boolean().default(true),
      priceMatch: z.boolean().default(true),
      cancellationDeadline: z.string().optional(),
      cancellationPolicy: z.string().optional(),
    })
    .optional(),

  notes: z.string().max(2000).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
    "CHECKED_IN",
    "CHECKED_OUT",
  ]),
});

export const updateReservationSchema = createReservationSchema.partial();

export const checkInSchema = z.object({
  roomNumber: z.string().min(1),
});

export const checkOutSchema = z.object({
  finalBill: z.number().min(0).optional(),
});

export const specialRequestSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1),
  additionalCost: z.number().min(0).default(0),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type SpecialRequestInput = z.infer<typeof specialRequestSchema>;
