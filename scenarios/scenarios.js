module.exports = {
  account_add_card: {
    definition: 'account.add_card',
    data: {
      card_uri: "${payload['card_uri'] if payload else request['account']['card_uri']}"
    },
    urlComponents: {
      account_id: "${request['account']['id']}"
    }
  },
  account_capture_hold: {
    
  },
  account_create: {
    
  },
  account_create_buyer: {
    
  },
  account_create_debit: {
    
  },
  account_create_hold: {
    
  },
  account_create_merchant: {
    
  },
  account_underwrite_business: {
    
  },
  account_underwrite_person: {
    
  },
  bank_account_create: {

  },
  bank_account_delete: {
    
  },
  bank_account_find_and_credit: {
    
  },
  bank_account_find_and_delete: {
    
  },
  bank_account_invalid_routing_number: {
    
  },
  bank_account_list: {
    
  },
  bank_account_show: {
    
  },
  bank_account_verification_create: {
    
  },
  bank_account_verification_show: {
    
  },
  bank_account_verification_update: {
    
  },
  callback_create: {
    
  },
  callback_delete: {
    
  },
  callback_list: {
    
  },
  callback_show: {
    
  },
  card_create: {
    
  },
  card_delete: {
    
  },
  card_invalidate: {
    
  },
  card_list: {
    
  },
  card_show: {
    
  },
  card_update: {
    
  },
  credit_account_list: {
    
  },
  credit_bank_account_list: {
    
  },
  credit_create_existing_bank_account: {
    
  },
  credit_create_new_bank_account: {
    
  },
  credit_customer_list: {
    
  },
  credit_failed_state: {
    
  },
  credit_list: {
    
  },
  credit_paid_state: {
    
  },
  credit_pending_state: {
    
  },
  credit_show: {
    
  },
  customer_add_bank_account: {
    
  },
  customer_add_card: {
    
  },
  customer_capture_hold: {
    
  },
  customer_create_debit: {
    
  },
  customer_create_hold: {
    
  },
  customer_credit: {
    
  },
  customer_delete: {
    
  },
  customer_underwrite: {
    
  },
  debit_account_list: {
    
  },
  debit_refund: {
    
  },
  debit_show: {
    
  },
  debit_update: {
    
  },
  event_list: {
    
  },
  event_replay: {
    
  },
  event_show: {
    
  },
  hold_account_list: {
    
  },
  hold_capture: {
    
  },
  hold_create: {
    
  },
  hold_customer_list: {
    
  },
  hold_list: {
    
  },
  hold_show: {
    
  },
  hold_update: {
    
  },
  hold_void: {
    
  },
  refund_account_list: {
    
  },
  refund_create: {
    
  },
  refund_customer_list: {
    
  },
  refund_list: {
    
  },
  refund_show: {
    
  },
  refund_update: {
    
  },
  reversals_create: {
    
  },
  reversals_list: {
    
  },
  reversals_show: {
    
  },
  reversals_update: {
    
  }
};