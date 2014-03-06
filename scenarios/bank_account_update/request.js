{{api}}.get('{{href}}').then(function (bank_account) {
    bank_account.meta = {
        'user_id': '123123123'
    };
    bank_account.save()
});
