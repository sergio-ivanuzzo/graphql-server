import express, {Application, Request, Response} from "express";
import dotenv from "dotenv";
import {ApolloServer} from "apollo-server-express";
import {mergeSchemas} from "@graphql-tools/schema";
import {setup as setupUserSchema} from "./graphql/users/schema";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

async function main() {
    const userSchema = await setupUserSchema();

    const schema = mergeSchemas({
        schemas: [userSchema]
    });

    const server = new ApolloServer({ schema });
    await server.start();

    server.applyMiddleware({ app });

    app.get("/", (req: Request, res: Response) => {
        res.send(`Server is running on ${port}`);
    });
}

main().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
})