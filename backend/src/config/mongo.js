import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb+srv://vitordsb2019:I1knWGKLuzgSO9w3@cluster0.zo8dnds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let connectPromise;

export function connectToMongo() {
  if (!connectPromise) {
    connectPromise = client.connect()
      .then(() => {
        console.log('✔️ Conectado ao MongoDB');
        return client.db();   // retorna o db padrão da URI
      })
      .catch(err => {
        connectPromise = null;  // permitir nova tentativa
        throw err;
      });
  }
  return connectPromise;
}

export {client}
