import { ObjectId } from "mongoose"

export interface RegisterDTO{
  email: string,
  password: string
}

export interface MappedRegisteredUserDTO{
  _id: ObjectId,
  id: ObjectId,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  roles: Array<ObjectId | any>,
  createdAt: string,
  updatedAt: string
}