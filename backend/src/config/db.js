import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://vitordsb2019:I1knWGKLuzgSO9w3@cluster0.zo8dnds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance;
export default async function getDb() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db();
    console.log('✔️ MongoDB conectado');
  }
  return dbInstance;
}


export { client };
