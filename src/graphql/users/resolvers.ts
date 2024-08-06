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
export class CreateUserInput implements Omit<User, "id"> {
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

@InputType()
export class UpdateUserInput implements Partial<Omit<User, "id">> {
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    age?: number;
    @Field(() => Role, { nullable: true })
    role?: Role;

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

    @Mutation(() => User, { name: "newUser" })
    async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
        const newUser = {
            ...input,
            id: v4()
        }

        this.users.push(newUser);

        return newUser;
    }

    @Mutation(() => User, { name: "user" })
    async updateUser(
        @Arg("id") id: string,
        @Arg("input") input: UpdateUserInput
    ): Promise<User | never> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new Error("User not found");
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...input,
        }

        return this.users[userIndex];
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: string): Promise<boolean | never> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new Error("User not found");
        }

        this.users.splice(userIndex, 1);

        return true;
    }
}