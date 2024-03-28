import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Assurez-vous d'importer correctement le service Prisma
import { Command, requiredFields } from './entities/command.entity'; // Assurez-vous d'importer correctement l'entité Command

const prisma = new PrismaClient();

@Injectable()
export class CommandService {
  async findAll() {
    const commands = await prisma.command.findMany();
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
    });

    return {
      message:
        command != null ? 'Command found successfully' : 'Command not found',
      data: command,
    };
  }

  async create(command: Command) {
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
      const newCommand = await prisma.command.create({
        data: {
          orderNumber: command.orderNumber,
          // date: new Date(),
          status: command.status,
          products: {
            create: command.products,
          },
        },
      });

      return {
        message: 'Command created successfully',
        data: newCommand,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'An error occurred during command creation.',
        data: null,
      };
    }
  }

  async update(id: number, updatedCommand: Command) {
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
      const command = await prisma.command.update({
        where: {
          id,
        },
        data: {
          orderNumber: updatedCommand.orderNumber,
          products: {
            create: updatedCommand.products,
          },
        },
      });

      return {
        message:
          command != null
            ? 'Command updated successfully'
            : 'Command not found',
        data: command,
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
