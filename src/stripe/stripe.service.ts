import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);
const prisma = new PrismaClient();

@Injectable()
export class StripeService {
  async createSession(email: string, commandId: number) {
    if (!email) {
      throw new HttpException('Email is required.', 400);
    }

    if (!commandId) {
      throw new HttpException('Command ID is required.', 400);
    }
    const command = await prisma.command.findUnique({
      where: {
        id: commandId,
      },
      include: { products: true },
    });
    if (!command) {
      throw new HttpException('Command not found.', 404);
    }
    const productPromises = command.products.map(async (product) => {
      return await prisma.product.findUnique({
        where: {
          id: product.id,
        },
        select: {
          id: true,
          description: true,
          price: true,
          username: true,
        },
      });
    });

    const products = await Promise.all(productPromises);
    if (products.length === 0) {
      throw new HttpException('No products found.', 404);
    }
    const totalPrice = products
      .map((product) => product.price)
      .reduce((a, b) => a + b)
      .toFixed(2);
    const quantity = products.length;
    const price = parseInt(totalPrice) * 100;

    console.log(products);
    console.log(totalPrice);
    console.log(quantity);

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
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        this.handleSuccessfulPayment(paymentIntentSucceeded);
        break;
      case 'charge.refunded':
        this.handleRefund(event.data.object);
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return 'Received';
  }

  private async handleSuccessfulPayment(payment) {
    console.log('Payment was successful', payment.id);
    //update le model commande de la base avec le status paid
    //add le paymentIntentId dans la commande
  }

  private async handleRefund(refund) {
    console.log('Refund was successful', refund.payment_intent);
    //update le model commande de la base avec le status refunded
    //envoyer le mail de refund
  }
}
