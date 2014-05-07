var bank_account = {{api}}.get('{{uri.bank_account}}')
{{api}}.get('{{uri.order}}').credit_to(bank_account, {{amount}})