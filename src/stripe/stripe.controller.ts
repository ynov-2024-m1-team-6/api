import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @UseGuards(AuthGuard)
  @Post('/session')
  async createSession(
    @Request() req,
    @Body()
    data: {
      email: string;
      id: [number];
      address: { address: string; city: string; postal_code: number };
    },
  ) {
    const userId = req['user']?.id;
    return this.stripeService.createSession(data.email, data.id, userId);
  }

  @Post('/refund')
  async refundPayment(@Body() data: { paymentId: string }) {
    return this.stripeService.refundPayment(data.paymentId);
  }

  @Post('/webhook')
  handleWebhook(@Request() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    this.stripeService.handleWebhook(req.rawBody, sig, endpointSecret);
  }
}
