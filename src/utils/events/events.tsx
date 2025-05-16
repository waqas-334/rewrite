export const HOME_EVENTS = {
  // When user taps the top upgrade button
  UPGRADE: "home_upgrade",

  // When user taps the Clear button at bottom left corner
  // After the rewritten text is shown. This will clear
  // both the input and output text
  HANDLE_CLEAR: "home_clear_text",

  // When user checks the text but doesn't have premium
  // At this point we are not sure if user has any tries left
  HANDLE_CHECK_NO_PREMIUM: "home_rewrite_no_premium",

  // When user checks the text but has no more tries
  HANDLE_CHECK_NO_MORE_TRIES: "home_rewrite_no_more_tries",

  // When user checks the text and has premium
  HANDLE_CHECK_PREMIUM: "home_rewrite_premium",

  // When user checks the text and gets a success
  // This will be logged for both free and premium users
  HANDLE_CHECK_SUCCESS: "home_rewrite_success",

  // When user checks the text and gets an error
  // This is not because of no premium or no more tries
  // This is some technical issue
  HANDLE_CHECK_ERROR: "home_rewrite_error",

  // When user copies the rewritten text
  HANDLE_COPY: "home_copy_output",

  // When user copies the rewritten text and fails
  HANDLE_COPY_FAILED: "home_copy_output_failed",

  //When user taps the share button on output text
  HANDLE_SHARE: "home_share_output",

  //When user opens the more modal
  OPEN_MORE_MODAL: "home_open_more_modal",

  REVIEW: {
    // When review popup is shown after there three checks has been done
    SHOW: "home_rate_after_checks",

    // When user clicks the "Not really" button on "Rating" Dialog
    // It doesn't necessarily have to come from Home screen
    NOT_REALLY: "review_not_really",

    // When user clicks the I love button on "Rating" Dialog but
    // for some reason the In-App Review did not show up, so had to redirect
    // to the App Store to review the app
    OPEN_APP_STORE: "review_app_store",

    // When the user clicks the I love button on "Rating" Dialog and the In-App Review shows up
    IN_APP_REVIEW_SHOWN: "review_in_app_review_shown",
  },
} as const;

export const MORE_MODAL_EVENTS = {
  // When user taps the "Rate" button on More Modal
  RATE: "more_modal_rate",

  // When user taps the "Share" button on More Modal
  SHARE: "more_modal_share",

  //When user taps Upgrade button on More Modal
  UPGRADE: "more_modal_upgrade",
} as const;

export const SUBSCRIPTION_EVENTS = {
  /**
   * Basically
   * subSrn -> Subscription Screen
   * hP -> Handle Purchase
   * pt -> Product Type
   * no_p -> No Product
   * mkePrchz -> Make Purchase
   * prchzSucss -> Purchase Success
   * prchzFail -> Purchase Fail
   * prchzFail_2_ -> Purchase Fail with specific plan type
   * hndlRstr -> Handle Restore
   * hndlRstr_success -> Restore Success
   * hndlRstr_no_restore -> Restore No Purchases
   * hndlRstr_failed -> Restore Failed
   */

  /**
   * THESE ARE THE SHORT FORM FOR SUB IDs
   *
   * grammar.monthly.premium -> mp
   *
   * grammar.weekly.premium -> wp
   *
   * grammar.annual.premium -> ap
   *
   * grammar.annual.premium.with_trial -> apwt
   *
   * grammar.annual.premium.with_offer -> apwo
   *
   */

  //This is the first event that is logged when user starts purchase for a specific plan type
  //The plan gets appended to the event name
  PURCHASE_START: "subSrn_hP_pt_",

  //Logged when product is not found for a plan type
  //The plan gets appended to the event name
  PURCHASE_NO_PRODUCT: "subSrn_hP_no_p_",

  //When user has tapped the "Upgrade" button on Subscription Modal
  //The product if found
  //And just before the pruchase function is called, this event is logged
  PURCHASE_MAKE_PURCHASE: "subS_hP_mkePrchz",

  //This is the event that is logged when purchase is successful
  PURCHASE_SUCCESS: "subS_hP_prchzSucss",

  //This is the event that is logged when purchase fails,
  //short form of the subscroption id is appended to the event name
  PURCHASE_FAIL: "subS_hP_prchzFail",

  //This is the event that is logged when purchase fails with specific plan type
  //This is in the catch block wrapping whole purchase function
  PURCHASE_FAIL_WITH_TYPE: "subS_hP_prchzFail_2_",

  // Restore purchase related events
  RESTORE_START: "subS_hndlRstr",

  //This is the event that is logged when restore is successful
  RESTORE_SUCCESS: "subS_hndlRstr_success",

  //This is the event that is logged when no purchases found to restore
  RESTORE_NO_PURCHASES: "subS_hndlRstr_no_restore",

  //This is the event that is logged when restore process fails
  RESTORE_FAILED: "subS_hndlRstr_failed",

  //User navigates back to home screen
  GO_BACK: "go_back_premium",
} as const;
