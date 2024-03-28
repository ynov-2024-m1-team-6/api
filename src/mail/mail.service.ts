// mail.service.ts

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Welcome to UberBagarre',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to UberBagarre</title>
            <style>
              /* Styles pour le corps du texte */
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }

              /* Style pour le conteneur principal */
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              /* Style pour le titre */
              h1 {
                color: #333;
              }

              /* Style pour le paragraphe */
              p {
                color: #666;
              }

              /* Style pour le lien */
              a {
                color: #007bff;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to UberBagarre</h1>
              <p>Hello ${data.firstName} ${data.lastName},</p>
              <p>Welcome to UberBagarre! We're thrilled to have you join our platform. Get ready to discover a whole new world of combat excitement.</p>
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The UberBagarre Team</p>
            </div>
          </body>
          </html>
        `,
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'error', error };
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 733de9a (feat(add): order, refund and admin mails)

  async sendRegistrationEmailToAdmin(data: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: 'uberbagarreynov@gmail.com', // Adresse e-mail de l'administrateur
        subject: 'New User Registration',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New User Registration</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New User Registration</h1>
              <p>Hello Admin,</p>
              <p>A new user has registered:</p>
              <ul>
                <li><strong>Customer Name:</strong> ${data.firstName} ${data.lastName}</li>
                <li><strong>Customer Email:</strong> ${data.email}</li>
              </ul>
              <p>Please review the registration details.</p>
            </div>
          </body>
          </html>
        `,
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'error', error };
    }
  }

  async sendOrderConfirmationEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
    orderNumber: number;
    products: any[];
  }) {
    try {
      const productListHTML = data.products
        .map(
          (product) => `
        <div class="product">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-details">
            <p class="product-name">${product.name}</p>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price} EUR</p>
          </div>
        </div>
      `,
        )
        .join('');

      await this.mailerService.sendMail({
        to: data.email,
        subject: `Order Confirmation #${data.orderNumber} for ${data.firstName} ${data.lastName}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #333;
              }

              .product {
                border-bottom: 1px solid #ccc;
                padding: 10px 0;
                margin-bottom: 20px;
              }

              .product img {
                max-width: 100px;
                max-height: 100px;
                margin-right: 20px;
                vertical-align: middle;
              }

              .product-details {
                display: inline-block;
                vertical-align: middle;
              }

              .product-name {
                font-weight: bold;
              }

              .product-description {
                color: #666;
              }

              .product-price {
                font-weight: bold;
                color: #007bff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Order Confirmation</h1>
              <p>Hello ${data.firstName} ${data.lastName},</p>
              <p>Your order (#${data.orderNumber}) has been confirmed! Here are the details:</p>
              ${productListHTML}
            </div>
          </body>
          </html>
        `,
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'error', error };
    }
  }

  async sendRefundRequestEmail(data: {
    email: string;
    firstName: string;
    lastName: string;
    orderNumber: number;
  }) {
    try {
      await this.mailerService.sendMail({
        to: 'bastienselot@gmail.com', // Adresse e-mail de l'administrateur
        subject: `Refund Request for Order #${data.orderNumber} from ${data.firstName} ${data.lastName}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Refund Request</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Refund Request</h1>
              <p>Hello Admin,</p>
              <p>An user has requested a refund for the following order:</p>
              <ul>
                <li><strong>Customer Name:</strong> ${data.firstName} ${data.lastName}</li>
                <li><strong>Customer Email:</strong> ${data.email}</li>
                <li><strong>Order Number:</strong> ${data.orderNumber}</li>
              </ul>
              <p>Please review the request and take appropriate action.</p>
            </div>
          </body>
          </html>
        `,
      });
      return { message: 'success' };
    } catch (error) {
      return { message: 'error', error };
    }
  }
<<<<<<< HEAD
=======
>>>>>>> 84f7c3c (feat(add): register mail)
=======
>>>>>>> 733de9a (feat(add): order, refund and admin mails)
}
