import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Delete,
  RawBodyRequest,
  Response,
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

  @Post('/refund')
  async refundPayment(@Body() data: { paymentId: string }) {
    return this.stripeService.refundPayment(data.paymentId);
  }

  @Post('/webhook')
  handleWebhook(@Request() req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret =
      'whsec_a89f99202fc9db06aa43695f17299b40621b79fb6640822019b7e638a31cb97b';
    this.stripeService.handleWebhook(req.rawBody, sig, endpointSecret);
  }
}
