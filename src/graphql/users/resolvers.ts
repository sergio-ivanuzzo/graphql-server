import "reflect-metadata";
import {Arg, Field, InputType, Mutation, ObjectType, Query, registerEnumType, Resolver} from "type-graphql";
import {v4} from "uuid";

export enum Role {
    USER = "user",
    ADMIN = "admin",
    MODERATOR = "moderator",
}

registerEnumType(Role, {
    name: "Role"
});

@ObjectType()
export class User {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    age: number;
    @Field(() => Role)
    role: Role;

    constructor(id: string, name: string, age: number, role: Role) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.role = role;
    }
}

@InputType()
export class UserInput implements Omit<User, "id"> {
    @Field()
    name: string;
    @Field()
    age: number;
    @Field(() => Role)
    role: Role;

    constructor(name: string, age: number, role: Role) {
        this.name = name;
        this.age = age;
        this.role = role;
    }
}

@Resolver(() => User)
export class UsersResolver {
    private users: User[] = [
        { id: v4(), name: "Alex", age: 22, role: Role.USER },
        { id: v4(), name: "Tanya", age: 21, role: Role.USER },
        { id: v4(), name: "Masha", age: 23, role: Role.MODERATOR },
        { id: v4(), name: "Sveta", age: 22, role: Role.USER },
        { id: v4(), name: "Bot", age: 0, role: Role.ADMIN },
    ];

    @Query(() => [User], { name: "users" })
    async getUsers(): Promise<User[]> {
        return this.users;
    }

    @Query(() => User, { name: "user" })
    async getUser(@Arg("id") id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    @Mutation(() => User, { name: "user" })
    async createUser(@Arg("input") input: UserInput): Promise<User> {
        const newUser = {
            ...input,
            id: v4()
        }

        this.users.push(newUser);

        return newUser;
    }
}