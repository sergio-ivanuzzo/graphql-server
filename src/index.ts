import express, {Application, Request, Response} from "express";
import dotenv from "dotenv";
import {ApolloServer} from "apollo-server-express";
import {mergeSchemas} from "@graphql-tools/schema";
import {setup as setupUsersSchema} from "./graphql/users/schema";
import {setup as setupRolesSchema} from "./graphql/roles/schema";
import {setup as setupExternalApisSchema} from "./graphql/external_apis/schema";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

async function main() {
    const userSchema = await setupUsersSchema();
    const rolesSchema = await setupRolesSchema();
    const externalApisSchema = await setupExternalApisSchema();

    const schema = mergeSchemas({
        schemas: [userSchema, rolesSchema, externalApisSchema],
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