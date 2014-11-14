var bank_account = {{api}}.get('{{uri.bank_account}}')
{{api}}.get('{{uri.order}}').debit_from(bank_account, {{amount}})

