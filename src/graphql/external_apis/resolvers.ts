import {Arg, Field, ObjectType, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import dotenv from "dotenv";

dotenv.config();

const OMDB_URL = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=movie`;

@ObjectType()
export class OMDBMovie {
    @Field()
    Title: string;
    @Field()
    Year: string;
    @Field()
    imdbID: string;
    @Field()
    Type: string;
    @Field()
    Poster: string;

    constructor(title: string, year: string, imdbID: string, type: string, poster: string) {
        this.Title = title;
        this.Year = year;
        this.imdbID = imdbID;
        this.Type = type;
        this.Poster = poster;
    }
}

@Service()
@Resolver()
class OMDBResolver {
    @Query(() => OMDBMovie)
    async getMoviesByQuery(@Arg("query") query: string): Promise<OMDBMovie[]> {
        let response = await fetch(`${OMDB_URL}&s=${query}`);
        let json: { Search: OMDBMovie[] } = await response.json();
        return json.Search ?? [];
    }
}

@Service()
@Resolver()
export class ExternalApiResolver {
    constructor(private readonly OMDBResolver: OMDBResolver) {}

    @Query(() => [OMDBMovie], { name: "movies" })
    async getOMDBMoviesByQuery(@Arg("query") query: string): Promise<OMDBMovie[]> {
        return this.OMDBResolver.getMoviesByQuery(query);
    }
}