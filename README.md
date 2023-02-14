

CALLING -> request:'MART' ----------------------------------------------------->

pack:{
  collect: 'collection name'
  store: 'store name'
  db: 'database name'
  methd: 'QUERY | REMOVE | INSERT | UPDATE'
  options: {
    QUERY:{
      query:{id:'itemid'}
    }
    REMOVE:{
      query:{id:'itemid'}
      multi: TRUE | FALSE
    }
    UPDATE:{
      query:{id:'itemid'}
      update:{$set:item}
      options:{}
    }
    INSERT:{
      docs: [items] || {item}
    }
  }
}

<------------------------------------------------------------------------------>

CALLING -> request:'ADMIN' ---------------------------------------------------->

pack:{
  collect: 'collection name'
  store: 'store name'
  db: 'database name'
  method: 'ADDCOLLECTION | REMOVECOLLECTION | COLLECTIONMAPS | ADDSTORE | REMOVESTORE | ADDDATABASE | REMOVEDATABASE'
}

method: 'ADDCOLLECTION'
- required - pack.collect: collection name (valid) that does not already exits.
- return

method: 'REMOVECOLLECTION'
- required - pack.collect: existing collection name
- return

method: 'COLLECTIONMAPS'
- optional - pack.collect: if existing collection name, for single map
- return

method: 'ADDSTORE'
- required - pack.collect: existing collection name
           - pack.store: store name (valid) that does not already exists.
- return

method: 'REMOVESTORE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
- return
method: 'ADDDATABASE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
           - pack.db: database name (valid) that does not already exists
- return
method: 'REMOVEDATABASE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
           - pack.db: existing database name
- return

<------------------------------------------------------------------------------>
