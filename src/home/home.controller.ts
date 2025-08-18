import { Body, Controller, Logger, Post } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    constructor (private readonly homeService: HomeService) {}

    @Post('/')
    async getHome(@Body() body: Object): Promise<Object> {
        // @ts-ignore
        return await this.homeService.getHome(body.user_id);
    }
}
