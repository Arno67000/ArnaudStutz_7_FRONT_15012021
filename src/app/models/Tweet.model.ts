import { User } from "./User.model";

export class Tweet {
    constructor(
        public content: string,
        public user: User,
        public id?: string,
        public date?: Date,
        public link?: string,
    ) {}
}