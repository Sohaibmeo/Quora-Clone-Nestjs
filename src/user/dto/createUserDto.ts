import { IsEmail, IsNumber, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto{
     @IsString()
     name:string

     @IsNumber()
     age:number

     @IsString()
     gender:string

     @IsEmail()
     email:string

     @IsString()
     username:string

     @IsStrongPassword()
     password: string

     @IsString()
     picture:string
}