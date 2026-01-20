import { Router, Request, Response } from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { db } from "@db/index";
import { users } from "@db/schema/users";
import { eq } from "drizzle-orm";
import { asyncHandler } from "@utils/errorHandler";
import { NotFoundError, BadRequestError } from "@utils/errors";
import { authenticateJWT, restrictTo } from "@middleware/auth";
import { validateRequest } from "@middleware/validation";
import { z } from "zod";
import dotenv from "dotenv";
import * as path from "path";

// Import email templates (you may need to convert these to TypeScript as well)
const generateEmailContent = require("../../Assets/EmailTemplate");
const messageEmail = require("../../Assets/MessageEmailTemplate");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const emailRoute = Router();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY || "";

/**
 * Send message email to multiple receivers (Protected - Admin, Product Owner, Scrum Master)
 * POST /api/emails/message
 */
emailRoute.post(
  "/emails/message",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateRequest(
    z.object({
      emailSender: z.string().email(),
      emailReceivers: z.array(z.string().email()).min(1),
      message: z.string().min(1),
      subject: z.string().min(1),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { emailSender, emailReceivers, message, subject } = req.body;

    if (!apiKey.apiKey) {
      throw new BadRequestError("Sendinblue API key not configured");
    }

    // Get sender data from database
    const senderResults = await db
      .select()
      .from(users)
      .where(eq(users.email, emailSender))
      .limit(1);

    if (senderResults.length === 0) {
      throw new NotFoundError("Sender not found");
    }

    const senderData = senderResults[0];
    const sender = {
      email: emailSender,
      name: senderData.firstName,
    };

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    try {
      const htmlContent = messageEmail(message, senderData.firstName);
      const emailReceiversList = emailReceivers.map((email: string) => ({ email }));

      const sendemail = await apiInstance.sendTransacEmail({
        sender,
        to: emailReceiversList,
        subject: subject,
        textContent: message,
        htmlContent: htmlContent,
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        data: sendemail,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new BadRequestError(`Failed to send email: ${error.message}`);
    }
  })
);

/**
 * Send email to a single receiver (Protected - Admin, Product Owner, Scrum Master)
 * POST /api/emails
 */
emailRoute.post(
  "/emails",
  authenticateJWT,
  restrictTo("Admin", "Product Owner", "Scrum Master"),
  validateRequest(
    z.object({
      senderEmail: z.string().email(),
      senderName: z.string().min(1),
      receiverEmail: z.string().email(),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { senderEmail, senderName, receiverEmail } = req.body;

    if (!apiKey.apiKey) {
      throw new BadRequestError("Sendinblue API key not configured");
    }

    // Get receiver data from database
    const receiverResults = await db
      .select()
      .from(users)
      .where(eq(users.email, receiverEmail))
      .limit(1);

    if (receiverResults.length === 0) {
      throw new NotFoundError("Receiver not found");
    }

    const receiverData = receiverResults[0];

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
      email: senderEmail,
      name: senderName,
    };

    try {
      const htmlContent = generateEmailContent(receiverData.firstName);
      const email = [
        {
          email: receiverData.email,
        },
      ];

      const sendemail = await apiInstance.sendTransacEmail({
        sender,
        to: email,
        subject: "Welcome to Project Management System",
        textContent: "Welcome!",
        htmlContent: htmlContent,
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        data: sendemail,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new BadRequestError(`Failed to send email: ${error.message}`);
    }
  })
);

export default emailRoute;
