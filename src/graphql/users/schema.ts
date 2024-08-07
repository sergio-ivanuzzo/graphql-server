import {buildSchema, NonEmptyArray} from "type-graphql";
import {UsersResolver} from "./resolvers";
import {Container} from "typedi";

// to split resolver into 2 resolvers:
// 1. npm install typedi
// 2. include typedi::Container into buildSchema
// 3. mark root resolver and dependency resolver as @Service()

export async function setup() {
    const resolvers = [UsersResolver] as NonEmptyArray<Function>;

    return await buildSchema({
        resolvers,
        emitSchemaFile: true,
        container: Container,
    });
}