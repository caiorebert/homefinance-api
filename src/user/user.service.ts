import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getUserById(id: number): Promise<any> {
        return this.userRepository.findOne({ where: { id: id } });  
    }

    async getUserByEmail(email: string): Promise<any> {
        return this.userRepository.
            findOne({
                select: ['id', 'email', 'name' ], 
                where: { email: email } 
            });
    }

    async create(userDTO: any): Promise<any> {
        const user = this.userRepository.create(userDTO);
        return this.userRepository.save(user);
    }
}
