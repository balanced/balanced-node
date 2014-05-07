var card = {{api}}.get('{{uri.card}}')
{{api}}.get('{{uri.order}}').debit_from(card, {{amount}})

