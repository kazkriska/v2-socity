create a postgres '.sql' file to create the following tables based on their given relations

1. society (table)

- id: PK, unique, serial

1. pocket (table)

- id: PK, unique, serial
- society_id: Foreign Key from society table
- pocket: varchar

1. resident (table)

- id: PK, unique, serial
- society_id: Foreign Key from society table
- pocket_id: Foreign Key from pocket table
- flat_number: int

1. payment (table)

- id: PK, unique, serial
- resident_id: Foreign Key from resident table
- amount_due: int
- late_fee: int
- due_date: date
- paid: boolean
- payment_date: date
- payment_for_month: enum (all months in a year)

relations:

- Each society item can relate to multiple pocket items
- Each pocket item can relate to multiple resident items
- Each reisdent item can relate to multiple payment items
