import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import { parse } from 'path';
import { CommandService } from 'src/command/command.service';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);
const prisma = new PrismaClient();

@Injectable()
export class StripeService {
  constructor(
    private commandService: CommandService,
    private productsService: ProductsService,
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
    const totalPrice = products
      .map((product) => product.price)
      .reduce((a, b) => a + b)
      .toFixed(2);
    const quantity = products.length;
    const price = parseInt(totalPrice) * 100;

    const filteredProducts = products.map((product) => {
      id: product.id;
      description: product.description;
      price: product.price;
      username: product.username;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Bagarreur',
            },
            unit_amount: price,
          },
          quantity,
        },
      ],
      mode: 'payment',
      metadata: { commandId: command.data['id'], order: 'order' },
      success_url: 'https://localhost:3000/stripe/webhook',
      cancel_url: 'https://example.com/cancel',
    });
    return session;
  }

  async refundPayment(paymentIntentId: string) {
    if (paymentIntentId === null) {
      throw new HttpException('Payment intent ID is required.', 400);
    }
    const session = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    if (!session) {
      throw new HttpException('Refund failed.', 400);
    }
    return 'Refund successful';
  }

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
    if (payment.metadata.order === 'order') {
      const commandId = parseInt(payment.metadata.commandId);
      const command = await prisma.command.update({
        where: {
          id: commandId,
        },
        data: {
          status: 'PAID',
          orderNumber: payment.payment_intent,
        },
      });
    }
    return null;
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
    //envoyer le mail de refund
  }
}
