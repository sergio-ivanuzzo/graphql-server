import {buildSchema, NonEmptyArray} from "type-graphql";
import {Container} from "typedi";
import {ExternalApiResolver} from "./resolvers";

export async function setup() {
    const resolvers = [ExternalApiResolver] as NonEmptyArray<Function>;

    return await buildSchema({
        resolvers,
        emitSchemaFile: true,
        container: Container,
    });
}