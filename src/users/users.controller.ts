import { Body, Controller, Get, Post, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import{ Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}
    
    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        const { email, password } = body;
        return this.authService.signup(email, password);
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password);
    }

    @Get('/:id')
   async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));

        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }


}
