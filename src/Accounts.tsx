import React from 'react';
import { compile, update } from './commands';
import { useSoql } from './soql-hooks';
import { Account, Contact } from './types';

const query = compile`
    Select
        Id
      , Name
      , Address
      , (Select Id, Foo from Contacts where Foo > '')
    from
        Account
    where
        Name > :condName`;

function Accounts() {
    const { loading, err, data, refetch } = useSoql<Partial<Account>>(query, { condName: '' });

    if (loading || !data) {
        return <div>Loading...</div>;
    }
    if (err) {
        return <div>Error!</div>;
    }

    const handleAccountClick = async (rec: Partial<Account>) => {
        await update('Account', {...rec, Name: `${rec.Name}+`});
        refetch();
    };

    const handleContactClick = async (rec: Partial<Contact>) => {
        await update('Contact', {...rec, Foo: `${rec.Foo}+`});
        refetch();
    };

    return (
        <div>
            <ul>{data.map(x =>
                <li key={x.Id} style={{cursor: 'pointer'}}>
                    <h3 onClick={() => handleAccountClick(x)}>{x.Name} - {x.Address}</h3>
                    <ul>{(x.Contacts?? []).map(c =>
                        <li key={c.Id}>
                            <div onClick={() => handleContactClick(c)}>{c.Foo}</div>
                        </li>
                    )}
                    </ul>
                </li>
            )}
            </ul>
        </div>
    );
}

export default Accounts;
