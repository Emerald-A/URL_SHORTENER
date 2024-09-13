import { Document, ObjectId } from 'mongoose'

//models
export interface IRoleDoc extends Document{
     
    name: string,
    description: string,
    slug: string,
    users: Array<ObjectId | any>,
    
    //generics
    createdAt: string,
    updatedAt: string,
    _id: ObjectId,
    id: ObjectId,
    //functions
    getAll(): Array<IRoleDoc>,
    findByName(name: string): IRoleDoc | null
}

export interface IUserDoc extends Document {

    avatar: string,
    username: string,
    email: string,
    password: string,
    slug: string;

    firstName: string,
    lastName: string,
    phoneNumber: string,
    phoneCode: string,

    roles: Array<ObjectId | any>

    createdAt: string,
    updateAt: string,
    _id: ObjectId,
    id: ObjectId,

    getUsers(): Array<IUserDoc>
    findById(id: any): IRoleDoc | null,
    matchPassword(password: string): Promise<boolean>,
    getAuthToken(): Promise<string>,

}

//Generics
export interface IResult{
    error: boolean,
    message: string,
    code?: number,
    data: any
}