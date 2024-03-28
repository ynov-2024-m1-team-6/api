import { Injectable, HttpException } from '@nestjs/common';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);
@Injectable()
export class StripeService {
  async createSession(email: string, price: number, quantity: number) {
    if (typeof price !== 'number') {
      throw new HttpException('Invalid price. Must be a number.', 400);
    }
    if (typeof quantity !== 'number') {
      throw new HttpException('Invalid quantity. Must be a number.', 400);
    }
    if (!email) {
      throw new HttpException('Email is required.', 400);
    }
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
