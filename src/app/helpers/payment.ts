import { supabase } from "../config/superbase.config";
import { MetaDataType } from "../types";
import { generateInvoiceId } from "./general";

export const handleSuccessfulPayment = async (
  paymentIntentId: string,
  metadata: MetaDataType
) => {
  try {
    if (
      !paymentIntentId ||
      !metadata.supabaseUserId ||
      !metadata.numberOfCredits ||
      !metadata.amount
    ) {
      return { error: "Missing required information to process payment" };
    }

    const { data: completedPayment, error: completedPaymentError } =
      await supabase
        .from("payments")
        .select("*")
        .eq("paymentIntentId", paymentIntentId)
        .limit(1)
        .maybeSingle();

    if (completedPayment?.id && completedPayment?.status === "paid") {
      return { error: "Payment transaction already processed" };
    }

    if (completedPaymentError?.message) {
      return {
        error: "Payment process error: " + completedPaymentError.message,
      };
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id,numOfCredits,totalCredits")
      .eq("email", metadata.userEmail)
      .single();

    if (!userData || !userData.id) {
      return {
        error: "Payment process error: Unable to retrieve user information",
      };
    }

    const { error: updatedUserError } = await supabase
      .from("users")
      .update({
        numOfCredits: (userData.numOfCredits || 0) + metadata.numberOfCredits,
        totalCredits: (userData.totalCredits || 0) + metadata.numberOfCredits,
      })
      .eq("email", metadata.userEmail)
      .select();

    if (updatedUserError) {
      return {
        error:
          "An error occured while processing payment: " +
          updatedUserError.message,
      };
    }

    const invoiceNumber = generateInvoiceId();

    const { error: updatePaymentError } = await supabase
      .from("payments")
      .upsert(
        {
          createdAt: completedPayment?.createdAt || new Date(),
          userEmail: completedPayment?.userEmail || metadata.userEmail,
          supabaseUserId:
            completedPayment?.supabaseUserId || metadata.supabaseUserId,
          status: "paid",
          datePaid: new Date(),
          creditsPurchased: metadata.numberOfCredits || 0,
          invoiceNumber: completedPayment?.invoiceNumber || invoiceNumber,
          amount: metadata.amount || 0,
          paymentIntentId,
        },
        { onConflict: "paymentIntentId" }
      )
      .single();

    if (updatePaymentError) {
      return {
        error:
          "An error occured while processing payment: " +
          updatePaymentError.message,
      };
    }

    return { success: true, paymentIntentId };
  } catch (error) {
    return {
      error: `Failed to process payment(${paymentIntentId}): ${error}`,
    };
  }
};

export const handleFailedPayment = async (
  paymentIntentId: string,
  metadata: MetaDataType
) => {
  try {
    if (
      !paymentIntentId ||
      !metadata.supabaseUserId ||
      !metadata.numberOfCredits ||
      !metadata.amount
    ) {
      return { error: "Missing required information to process payment" };
    }

    const { data: completedPayment, error: completedPaymentError } =
      await supabase
        .from("payments")
        .select("*")
        .eq("paymentIntentId", paymentIntentId)
        .limit(1)
        .maybeSingle();

    if (
      completedPayment?.id &&
      (completedPayment?.status === "paid" ||
        completedPayment?.status === "failed")
    ) {
      return { error: "Payment transaction already processed" };
    }

    if (completedPaymentError?.message) {
      return {
        error: "Payment process error: " + completedPaymentError.message,
      };
    }

    const invoiceNumber = generateInvoiceId();

    const { error: updatePaymentError } = await supabase
      .from("payments")
      .upsert(
        {
          createdAt: completedPayment?.createdAt || new Date(),
          userEmail: completedPayment?.userEmail || metadata.userEmail,
          supabaseUserId:
            completedPayment?.supabaseUserId || metadata.supabaseUserId,
          status: "failed",
          dateFailed: new Date(),
          creditsPurchased: metadata.numberOfCredits || 0,
          invoiceNumber: completedPayment?.invoiceNumber || invoiceNumber,
          amount: metadata.amount || 0,
          paymentIntentId,
        },
        { onConflict: "paymentIntentId" }
      )
      .single();

    if (updatePaymentError) {
      return {
        error:
          "An error occured while processing payment: " +
          updatePaymentError.message,
      };
    }
    return { success: true, paymentIntentId };
  } catch (error) {
    return {
      error: `Failed to process payment(${paymentIntentId}): ${error}`,
    };
  }
};

export const handleProcessingPayment = async (
  paymentIntentId: string,
  metadata: MetaDataType
) => {
  try {
    if (
      !paymentIntentId ||
      !metadata.supabaseUserId ||
      !metadata.numberOfCredits ||
      !metadata.amount
    ) {
      return { error: "Missing required information to process payment" };
    }

    const invoiceNumber = generateInvoiceId();

    const { error: updatePaymentError } = await supabase
      .from("payments")
      .insert({
        createdAt: new Date(),
        userEmail: metadata.userEmail,
        supabaseUserId: metadata.supabaseUserId,
        status: "pending",
        creditsPurchased: metadata.numberOfCredits || 0,
        invoiceNumber,
        amount: metadata.amount || 0,
        paymentIntentId,
      })
      .select()
      .single();

    if (updatePaymentError) {
      return {
        error:
          "An error occured while processing payment: " +
          updatePaymentError.message,
      };
    }

    return { success: true, paymentIntentId };
  } catch (error) {
    return { error: `Failed to process payment(${paymentIntentId}): ${error}` };
  }
};
