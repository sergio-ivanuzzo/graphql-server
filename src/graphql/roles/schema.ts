import {buildSchema, NonEmptyArray} from "type-graphql";
import {RolesResolver} from "./resolvers";

export async function setup() {
    const resolvers = [RolesResolver] as NonEmptyArray<Function>;

    return await buildSchema({
        resolvers,
        emitSchemaFile: true,
    });
}