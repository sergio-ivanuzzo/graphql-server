import "reflect-metadata";
import {Arg, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root} from "type-graphql";
import {v4} from "uuid";
import {Role, RolesResolver} from "../roles/resolvers";
import {Service} from "typedi";

@ObjectType()
export class User {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    age: number;

    constructor(id: string, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

@InputType()
export class CreateUserInput implements Omit<User, "id"> {
    @Field()
    name: string;
    @Field()
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

@InputType()
export class UpdateUserInput implements Partial<Omit<User, "id">> {
    @Field({ nullable: true })
    name?: string;
    @Field({ nullable: true })
    age?: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

@Service()
@Resolver(() => User)
export class UsersResolver {
    private users: User[] = [
        { id: "1", name: "Alex", age: 22 },
        { id: "2", name: "Tanya", age: 21 },
        { id: "3", name: "Masha", age: 23 },
        { id: "4", name: "Sveta", age: 22 },
        { id: "5", name: "Bot", age: 0 },
    ];

    constructor(private readonly rolesResolver: RolesResolver) {}

    @FieldResolver(() => Role)
    async role(@Root() user: User): Promise<Role | undefined> {
        return this.rolesResolver.getRoleById(user.id);
    }

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