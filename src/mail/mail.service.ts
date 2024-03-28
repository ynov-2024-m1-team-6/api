// mail.service.ts

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(data: {
    firstName: string;
    lastName: string;
    mail: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.mail,
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
}
