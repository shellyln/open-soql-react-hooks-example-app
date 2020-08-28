
import { build } from 'open-soql/modules/builder';
import { Account_norels, Contact_norels } from './types';



type Store = {
    Account: Account_norels[];
    Contact: Contact_norels[];
};

const store: Store = {
    Account: [
        { Id: 'Account/z1', Name: 'bbb/z1', Address: 'ccc/z1' },
        { Id: 'Account/z2', Name: 'bbb/z2', Address: 'ccc/z2' },
        { Id: 'Account/z3', Name: 'bbb/z3', Address: 'ccc/z3' },
        { Id: 'Account/z4', Name: null    , Address: null     },
        { Id: 'Account/z5', Name: ''      , Address: ''       },
    ],
    Contact: [
        { Id: 'Contact/z1', Foo: 'aaa/z1', AccountId: 'Account/z1' },
        { Id: 'Contact/z2', Foo: 'aaa/z2', AccountId: 'Account/z1' },
        { Id: 'Contact/z3', Foo: 'aaa/z3', AccountId: 'Account/z2' },
        { Id: 'Contact/z4', Foo: null    , AccountId: null         },
        { Id: 'Contact/z5', Foo: ''      , AccountId: null         },
    ],
};

export const { compile, soql, insert, update, remove, touch, transaction, subscribe, unsubscribe } = build({
    relationships: {
        Account: { Contacts: ['Contact'] },
        Contact: { Account: 'Account' },
    },
    resolvers: {
        query: {
            Account: (fields, conditions, limit, offset, ctx) => {
                let data = store.Account;
                if (ctx.parent && ctx.parentType === 'detail') {
                    data = data.filter(x => x.Id === (ctx.parent as any)[ctx.foreignIdField!]);
                }
                return Promise.resolve(data.map(x => ({...x})));
            },
            Contact: (fields, conditions, limit, offset, ctx) => {
                let data = store.Contact;
                if (ctx.parent && ctx.parentType === 'master') {
                    data = data.filter(x => x.AccountId === (ctx.parent as any)[ctx.masterIdField!]);
                }
                return Promise.resolve(data.map(x => ({...x})));
            },
        },
        update: {
            Account: (records: Partial<Account_norels>[], ctx) => {
                const ret: Partial<Account_norels>[] = [];
                for (const rec of records) {
                    const index = store.Account.findIndex(x => x.Id === rec.Id);
                    if (index < 0) {
                        throw new Error('Record is not exists!');
                    }

                    const original = store.Account[index];
                    const changed = { ...original, ...rec };

                    store.Account[index] = changed;
                    ret.push(changed)
                }
                return Promise.resolve(ret);
            },
            Contact: (records: Partial<Contact_norels>[], ctx) => {
                const ret: Partial<Contact_norels>[] = [];
                for (const rec of records) {
                    const index = store.Contact.findIndex(x => x.Id === rec.Id);
                    if (index < 0) {
                        throw new Error('Record is not exists!');
                    }

                    const original = store.Contact[index];
                    const changed = { ...original, ...rec };

                    store.Contact[index] = changed;
                    ret.push(changed)
                }
                return Promise.resolve(ret);
            },
        }
    },
});
