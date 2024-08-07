import "reflect-metadata";
import {Arg, Field, ObjectType, Query, registerEnumType, Resolver} from "type-graphql";
import {Service} from "typedi";

export enum Role {
    USER = "user",
    ADMIN = "admin",
    MODERATOR = "moderator",
}

registerEnumType(Role, {
    name: "Role"
});

@ObjectType()
export class RoleMap {
    @Field()
    id: string;
    @Field()
    role: Role;

    constructor(id: string, role: Role) {
        this.id = id;
        this.role = role;
    }
}

@Service()
@Resolver()
export class RolesResolver {
    private roles: RoleMap[] = [
        { id: "1", role: Role.USER },
        { id: "2", role: Role.USER },
        { id: "3", role: Role.MODERATOR },
        { id: "4", role: Role.USER },
        { id: "5", role: Role.ADMIN },
    ];

    constructor() {}

    @Query(() => Role, { name: "role" })
    async getRoleById(@Arg("id") id: string): Promise<Role | undefined> {
        return this.roles.find(role => role.id === id)?.role;
    }
}