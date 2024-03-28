import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('sendWelcomeEmail')
  sendWelcomeEmail(
    @Body() data: { firstName: string; lastName: string; email: string },
  ) {
    this.mailService.sendWelcomeEmail(data);
    this.mailService.sendRegistrationEmailToAdmin(data);
  }

  @Post('sendOrderConfirmation')
  sendOrderConfirmation(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      orderNumber: string;
      products: any[];
    },
  ) {
    return this.mailService.sendOrderConfirmationEmail(data);
  }

  @Post('sendRefundRequestEmail')
  sendRefundRequestEmail(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      orderNumber: string;
    },
  ) {
    return this.mailService.sendRefundRequestEmail(data);
  }
}
