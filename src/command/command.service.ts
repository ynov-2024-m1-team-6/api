import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import { Command, requiredFields } from './entities/command.entity'; // Assurez-vous d'importer correctement l'entité Command
import { MailService } from 'src/mail/mail.service';
const prisma = new PrismaClient();

@Injectable()
export class CommandService {
  constructor(private mailService: MailService) {}
  async findAll() {
    const commands = await prisma.command.findMany({
      include: {
        products: true, // Inclure les produits associés à chaque commande
      },
    });
    return {
      message:
        commands.length != 0
          ? 'Commands retrieved successfully'
          : 'No commands found',
      data: commands,
    };
  }

  async findOne(id: number) {
    // If the ID is not a number, return an error message
    if (isNaN(id)) {
      return {
        message: 'Invalid ID. Please provide a valid numeric ID.',
        data: null,
      };
    }

    const command = await prisma.command.findUnique({
      where: {
        id,
      },
      include: {
        products: true, // Inclure les produits associés à chaque commande
      },
    });

    return {
      message:
        command != null ? 'Command found successfully' : 'Command not found',
      data: command,
    };
  }

  async findAllCommandsByUserId(userId: number) {
    const commands = await prisma.command.findMany({
      where: {
        userId: userId,
      },
      include: {
        products: true,
      },
    });
    return {
      message:
        commands.length != 0
          ? 'Commands retrieved successfully'
          : 'No commands found',
      data: commands,
    };
  }

  async findById(id: string) {
    const idParse = parseInt(id);
    const command = await prisma.command.findUnique({
      where: {
        id: idParse,
      },
      include: {
        products: true,
      },
    });
    return {
      message:
        command != null ? 'Command found successfully' : 'Command not found',
      data: command,
    };
  }

  async findByFilter(filter: any) {
    try {
      const command = await prisma.command.findMany({
        where: filter,
        include: {
          products: true,
        },
      });
      return {
        message:
          command != null ? 'Command found successfully' : 'Command not found',
        data: command,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command retrieval.',
        data: null,
      };
    }
  }

  async create(command: Command, userId: number) {
    // If the request body is empty, return an error message
    if (!command || Object.keys(command).length === 0) {
      return {
        message: 'Command creation failed. Request body is empty.',
        data: null,
      };
    }

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter((field) => !(field in command));

    // If any required fields are missing, return an error message
    if (missingFields.length > 0) {
      return {
        message: `Command creation failed. Required fields are missing`,
        data: missingFields,
      };
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return {
          message: 'User not found',
          data: null,
        };
      }

      const newCommand = await prisma.command.create({
        data: {
          orderNumber: command.orderNumber,
          status: command.status,
          products: {
            connect: command.products.map((productId) => ({
              id: productId.id,
            })),
          },
          userId: userId,
          email: user.mail,
        },
        include: {
          products: true, // Inclure les produits associés à chaque commande
        },
      });

      const commandN = await prisma.command.update({
        where: {
          id: newCommand.id,
        },
        data: {
          orderNumber: `CMD-${newCommand.id}`,
        },
        include: {
          products: true,
        },
      });

      return {
        message: 'Command created successfully',
        data: commandN,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command creation.',
        data: null,
      };
    }
  }

  async reimbursement(id: number, userId: number) {
    // If the ID is not a number, return an error message
    if (isNaN(id)) {
      return {
        message: 'Invalid ID. Please provide a valid numeric ID.',
        data: null,
      };
    }

    try {
      const command = await prisma.command.findUnique({
        where: {
          id,
        },
      });

      if (!command) {
        return {
          message: 'Command not found',
          data: null,
        };
      }

      if (command.userId !== userId) {
        return {
          message: 'You are not authorized to refund this command',
          data: null,
        };
      }

      const commandRefunded = await prisma.command.update({
        where: {
          id: command.id,
        },
        data: {
          status: 'REIMBURSEMENT',
        },
        include: {
          products: true, // Inclure les produits associés à chaque commande
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: command.userId,
        },
      });

      await this.mailService.sendRefundRequestEmail({
        firstName: user.firstName,
        lastName: user.name,
        email: user.mail,
        orderNumber: command.orderNumber,
      });

      return {
        message:
          commandRefunded != null
            ? 'Command reimbursement initiated'
            : 'Command not found',
        data: commandRefunded,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command refund.',
        data: null,
      };
    }
  }

  async update(id: number, updatedCommand: Command, userId: number) {
    // If the ID is not a number, return an error message
    if (isNaN(id)) {
      return {
        message: 'Invalid ID. Please provide a valid numeric ID.',
        data: null,
      };
    }

    // If the request body is empty, return an error message
    if (!updatedCommand || Object.keys(updatedCommand).length === 0) {
      return {
        message: 'Command update failed. Request body is empty.',
        data: null,
      };
    }

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter(
      (field) => !(field in updatedCommand),
    );

    // If any required fields are missing, return an error message
    if (missingFields.length > 0) {
      return {
        message: `Command update failed. Required fields are missing`,
        data: missingFields,
      };
    }

    try {
      const command = await prisma.command.findUnique({
        where: {
          id,
        },
        include: {
          products: true, // Inclure les produits associés à chaque commande
        },
      });

      if (!command) {
        return {
          message: 'Command not found',
          data: null,
        };
      }

      // filter les produits dans updatedCommand.products qui sont déjà dans command.products
      updatedCommand.products = updatedCommand.products.filter(
        (product) => !command.products.some((p) => p.id === product.id),
      );

      if (command.userId !== userId) {
        return {
          message: 'You are not authorized to update this command',
          data: null,
        };
      }

      const commandUpdated = await prisma.command.update({
        where: {
          id: command.id,
        },
        data: {
          orderNumber: updatedCommand.orderNumber,
          products: {
            connect: updatedCommand.products.map((productId) => ({
              id: productId.id,
            })),
          },
        },
        include: {
          products: true, // Inclure les produits associés à chaque commande
        },
      });

      return {
        message:
          commandUpdated != null
            ? 'Command updated successfully'
            : 'Command not found',
        data: commandUpdated,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command update.',
        data: null,
      };
    }
  }
}
