import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri, {});
}

export const getDb = async (): Promise<Db> => {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(process.env.MONGODB_DB);
};

export default client;
