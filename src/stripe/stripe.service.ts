/* eslint-disable prettier/prettier */
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);
const prisma = new PrismaClient();

@Injectable()
export class StripeService {
  async createSession(
    email: string,
    price: number,
    quantity: number,
    commandId: number,
  ) {
    if (typeof price !== 'number') {
      throw new HttpException('Invalid price. Must be a number.', 400);
    }
    if (typeof quantity !== 'number') {
      throw new HttpException('Invalid quantity. Must be a number.', 400);
    }
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
      });
    });
    const products = await Promise.all(productPromises);
    if (products.length === 0) {
      throw new HttpException('No products found.', 404);
    }
    const totalPrice = products
      .map((product) => product.price)
      .reduce((a, b) => a + b);

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
            unit_amount: price * 100,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    return session;
  }
}
