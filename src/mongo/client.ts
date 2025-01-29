import {
    MongoClient,
    MongoClientOptions
} from 'mongodb';

const options: MongoClientOptions = {} as MongoClientOptions;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const getClient = () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    const uri = process.env.MONGODB_URI;

    client = new MongoClient(uri, options);
    clientPromise = client.connect();

    return clientPromise;
};

export default getClient;
