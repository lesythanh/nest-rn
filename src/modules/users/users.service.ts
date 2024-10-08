import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({email});
    if(user) {
      return true;
    } else {
      return false;
    }
  }
  async create(createUserDto: CreateUserDto) {
    const {name, email, password, phone, address, image} = createUserDto;
    //check email is exist
    const isEmailExist = await this.isEmailExist(email);
    if(isEmailExist) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng chọn email khác`);
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    
    const user =  await this.userModel.create({
      name, email,
      password: hashPassword,

    });

    return {
      _id: user._id,
      // name: user.name,
      // email: user.email,
      // phone: user.phone,
      // address: user.address,
      // image: user.image,
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);

    if(filter.current) delete filter.current;
    if(filter.pageSize) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize

    const result = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select('-password')
    .sort(sort as any);

    return {result, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({email});
  }

  async update( updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto});
  }

  remove(id: string) {
    //check id is exist
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({_id: id});
    }else {
      throw new BadRequestException(`Id không hợp lệ: ${id}`);
    }
  }
}
