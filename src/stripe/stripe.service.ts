/* eslint-disable prettier/prettier */
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import { CommandService } from 'src/command/command.service';
import { ProductsService } from 'src/products/products.service';
import { MailService } from 'src/mail/mail.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);
const prisma = new PrismaClient();

@Injectable()
export class StripeService {
  constructor(
    private commandService: CommandService,
    private productsService: ProductsService,
    private mailService: MailService,
  ) {}
  async createSession(email: string, id: [number], userId: number) {
    if (!email) {
      throw new HttpException('Email is required.', 400);
    }
    if (!id) {
      throw new HttpException('Product ID is required.', 400);
    }
    if (!userId) {
      throw new HttpException('User ID is required.', 400);
    }

    const productPromises = await prisma.product.findMany({
      where: {
        id: {
          in: id,
        },
      },
    });
    const products = await Promise.all(productPromises);
    if (products.length === 0) {
      throw new HttpException('No products found.', 404);
    }
    const commandData = {
      email,
      products: products,
    };
    const command = await this.commandService.create(commandData, userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: products.map((product) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.username,
            description: product.description,
            images: [`${product.thumbnail}?size=200x200`], // Spécifiez la taille de l'image ici
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      })),
      mode: 'payment',
      metadata: { commandId: command.data['id'] },
      success_url: `https://uberbagarre.netlify.app/payment/success?id=${command.data['id']}`,
      cancel_url: 'https://uberbagarre.netlify.app/payment/failed',
    });
    return session.url;
  }

  async refundPayment(paymentIntentId: string) {
    if (!paymentIntentId) { // Vérifie si paymentIntentId est présent
      throw new HttpException('Payment intent ID is required.', 400);
    }

    try {
      const refundedCommand = await prisma.command.findFirst({
        where: { orderNumber: paymentIntentId },
      });
  
      if (!refundedCommand) {
        throw new HttpException('Command not found.', 404);
      }
  
      console.log(refundedCommand);
      const idfloatToInteger = parseInt(refundedCommand.id as any);
      await prisma.command.update({
        where: { id: idfloatToInteger },
        data: { status: 'REFUNDED' },
      });
      const session = await stripe.refunds.create({ payment_intent: paymentIntentId });
      if (!session) {
        throw new HttpException('Refund failed.', 400);
      }
      return 'Refund successful';
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred during the refund process.', 500);
    }
};


  async handleWebhook(
    requestBody: Buffer,
    sig: string,
    endpointSecret: string,
  ): Promise<string> {
    let event: Stripe.Event;

    try {
      event = Stripe.webhooks.constructEvent(requestBody, sig, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case 'charge.refunded':
        this.handleRefund(event.data.object);
      case 'checkout.session.completed':
        this.handleSuccessfulPayment(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return 'Received';
  }

  private async handleSuccessfulPayment(payment) {
    const commandId = parseInt(payment.metadata.commandId);
    const command = await prisma.command.update({
      where: {
        id: commandId,
      },
      data: {
        status: 'PAID',
        orderNumber: payment.payment_intent,
      },
      include: {
        products: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: command.userId,
      },
    });

    await this.mailService.sendOrderConfirmationEmail({
      firstName: user.firstName,
      lastName: user.name,
      email: user.mail,
      orderNumber: command.orderNumber,
      products: command.products,
    });
    //envoyer le mail de confirmation
  }

  private async handleRefund(refund) {
    const refundedCommand = await prisma.command.findFirst({
      where: {
        orderNumber: refund.payment_intent,
      },
    });
    await prisma.command.update({
      where: {
        id: refundedCommand.id,
      },
      data: {
        status: 'REFUNDED',
      },
    });
  }
}
