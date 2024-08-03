import {buildSchema, NonEmptyArray} from "type-graphql";
import {UsersResolver} from "./resolvers";

export async function setup() {
    const resolvers = [UsersResolver] as NonEmptyArray<Function>;

    return await buildSchema({
        resolvers,
        emitSchemaFile: true,
    });
}