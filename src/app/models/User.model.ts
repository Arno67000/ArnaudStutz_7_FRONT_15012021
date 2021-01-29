export class User {
    constructor (public pseudo: string,
                public firstName: string, 
                public lastName: string,
                public password: string,
                public role?: string,
                public id?: string,
                public token?: string,
                public isAuth?: boolean) {}
}