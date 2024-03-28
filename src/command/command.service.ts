import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import { Command, requiredFields } from './entities/command.entity'; // Assurez-vous d'importer correctement l'entité Command

const prisma = new PrismaClient();

@Injectable()
export class CommandService {
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

  async findByOrderNumber(orderNumber: string) {
    if (orderNumber === '00000000') {
      return {
        message: 'Invalid order number. Please provide a valid order number.',
        data: null,
      };
    }
    try {
      const command = await prisma.command.findFirst({
        where: {
          orderNumber,
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

      return {
        message: 'Command created successfully',
        data: newCommand,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command creation.',
        data: null,
      };
    }
  }

  async refund(id: number) {
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

      const commandRefunded = await prisma.command.update({
        where: {
          id: command.id,
        },
        data: {
          status: 'REFUNDED',
        },
        include: {
          products: true, // Inclure les produits associés à chaque commande
        },
      });

      return {
        message:
          commandRefunded != null
            ? 'Command refunded successfully'
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

  async delete(id: number) {
    // If the ID is not a number, return an error message
    if (isNaN(id)) {
      return {
        message: 'Invalid ID. Please provide a valid numeric ID.',
        data: null,
      };
    }

    try {
      const command = await prisma.command.delete({
        where: {
          id,
        },
      });

      return {
        message:
          command != null
            ? 'Command deleted successfully'
            : 'Command not found',
        data: command,
      };
    } catch (error) {
      return {
        message: 'An error occurred during command deletion.',
        data: null,
      };
    }
  }
}
