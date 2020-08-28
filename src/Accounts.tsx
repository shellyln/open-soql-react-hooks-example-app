
import   React,
       { useState,
         useEffect }   from 'react';
import { Subscriber }  from 'open-soql/modules/types';
import { Account,
         Contact }     from './types';
import { compile,
         update,
         subscribe,
         unsubscribe } from './commands';
import { useSoql }     from './soql-hooks';
import                      './Accounts.css';



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

    const subscriber_: Subscriber = ({resolver, on, id}) => {
        refetch();
    };
    const [{subscriber}] = useState({subscriber: subscriber_});

    // Subscribe to DML events with side effects hook.
    // When unsubscribing, you need to pass the same function object as when subscribing.
    useEffect(() => {
        const d = data;
        if (d) {
            for (const acc of d) {
                subscribe('Account', acc.Id, subscriber);
                for (const con of acc.Contacts ?? []) {
                    subscribe('Contact', con.Id, subscriber);
                }
            }
        }

        return () => {
            if (d) {
                for (const acc of d) {
                    unsubscribe('Account', acc.Id, subscriber);
                    for (const con of acc.Contacts ?? []) {
                        unsubscribe('Contact', con.Id, subscriber);
                    }
                }
            }
        }
    });

    if (loading || !data) {
        return <div>Loading...</div>;
    }
    if (err) {
        return <div>Error!</div>;
    }

    const handleAccountClick = async (rec: Partial<Account>) => {
        await update('Account', {...rec, Name: `${rec.Name}+`});
    };

    const handleContactClick = async (rec: Partial<Contact>) => {
        await update('Contact', {...rec, Foo: `${rec.Foo}+`});
    };

    return (
        <div className="Accounts-wrap">
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
