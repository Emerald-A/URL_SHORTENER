import { RegisterDTO } from "../dtos/auth.dto";
import { CreateUserDTO } from "../dtos/user.dto";
import Role from "../models/Role.model";
import User from "../models/User.model";
import { UserType } from "../utils/enums.utils";
import { IResult, IUserDoc } from "../utils/interface.util";

class UserService {

    constructor(){}

    /**
     * @name checkEmail
     * @param email 
     * @description - Email validation with regEx
     * @returns (boolean)
     */
    public checkEmail(email: string): boolean{
        const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regexMail.test(email)
    }

    /**
     * @name checkPassword
     * @param password 
     * @description - Password validation with regEx
     * @returns (boolean)
     */
    public checkPassword(password: string): boolean{
        const regexPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
        return regexPass.test(password)
    }

    /**
     * @name createUser
     * @param data 
     * @description creates users in the db and assigns roles
     * @returns users
     */
    public async createUser(data: CreateUserDTO): Promise<IUserDoc>{
        const { email, password, firstName, lastName, phoneCode, phoneNumber, username, userType } = data;
    
        //create user in the database
        const user = await User.create({
            email: email,
            password: password,
            firstName: firstName ? firstName : "",
            lastName: lastName ? lastName : "",
            username: username ? username : "",
            phoneCode: phoneCode ? phoneCode : "+234",
            phoneNumber: phoneNumber ? phoneNumber : ""
        });

        // attach role
        await this.attachRole(user, userType);

        return user;

    }

    /**
     * @name attachRole
     * @param user 
     * @description attach each role to the users of the app
     * @param type 
     */
    public async attachRole(user: IUserDoc, type: string): Promise<void>{
        const userRole = await Role.findOne({ name: UserType.USER })
        const role = await Role.findOne({ name: type })
       
        if (type === UserType.ADMIN && userRole && role) {
            user.roles.push(userRole._id);
            user.roles.push(role._id);

            await user.save()
        }

        if (type === UserType.BUSINESS && userRole && role) {
            user.roles.push(userRole._id);
            user.roles.push(role._id);

            await user.save()
        }
    }
}

export default new UserService()