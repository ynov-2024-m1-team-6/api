import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('/session')
  async createSession(
    @Request() req,
    @Body()
    data: { email: string; commandId: number },
  ) {
    const userId = req['user']?.id;
    return this.stripeService.createSession(data.email, data.commandId);
  }
}
