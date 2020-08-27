
export interface Account_norels {
    Id: string;
    Name: string | null;
    Address: string | null;
}

export interface Account extends Account_norels {
    Contacts: Contact[] | null;
}

export interface Contact_norels {
    Id: string;
    Foo: string | null;
    AccountId: string | null;
}

export interface Contact extends Contact_norels {
    Account: Account;
}
