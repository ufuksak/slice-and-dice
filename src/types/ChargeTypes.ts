export enum ChargeStatus {
  /**
   * Charge is not yet pre-authorized, in order to proceed
   * user needs to perform an action (action depends on bank requirements, typically 2FA SMS, or other 3DS flow)
   */
  RequiresAction = 'requiresAction',
  /**
   * Charge is pre-authorized, the amount is now being held on the credit card / payment method
   */
  Pending = 'pending',
  /**
   * Charge is actively processing, it has already been authorized by the user and we are waiting on the financial institution
   * to confirm that the charge went through. Because communication is async here, it is unknown if the charge will succeed or fail at this point.
   */
  Processing = 'processing',
  /**
   * The amount on the charge is now captured
   */
  Succeeded = 'succeeded',
  /**
   * Capturing of the charge failed due to some error, new charge will have to be created.
   */
  Failed = 'failed',
  /**
   * Charge is partially / or fully refunded back to the customer
   */
  Refunded = 'refunded',
  /**
   * Charge is cancelled after if was pre-authorized.
   */
  Cancelled = 'cancelled',
}
