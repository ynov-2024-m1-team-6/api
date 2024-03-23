import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Product, requiredFields } from './entities/product.entity';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async findAll(filterInactive: string | undefined) {
    const isActive = filterInactive === 'true';

    let products;
    if (!isActive) {
      products = await prisma.product.findMany();
    } else {
      products = await prisma.product.findMany({
        where: {
          active: true,
        },
      });
    }

    return {
      message:
        products.length != 0
          ? 'Products retrieved successfully'
          : 'No products found',
      data: products,
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

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return {
      message:
        product != null ? 'Product found successfully' : 'Product not found',
      data: product,
    };
  }

  async GetSpecificProduct(id: number[]) {
    let ids: number[];

    ids =
      typeof id === 'object'
        ? (ids = id
            .filter((str) => !isNaN(Number(str)) && str != 0)
            .map((str) => Number(str)))
        : [typeof id === 'string' ? Number(id) : id];
    // vérifie qu'il n'y a pas de lettre et transforme en nombre le nombre

    try {
      const product = await prisma.product.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return {
        message:
          product.length != 0
            ? 'Products found successfully'
            : 'Product not found',
        data: product,
      };
    } catch (error) {
      return {
        message: 'An error occurred during product collection.',
        data: null,
      };
    }
  }

  async create(product: Product) {
    // If the request body is empty, return an error message
    if (!product || Object.keys(product).length === 0) {
      return {
        message: 'Product creation failed. Request body is empty.',
        data: null,
      };
    }

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter((field) => !(field in product));

    // If any required fields are missing, return an error message
    if (missingFields.length > 0) {
      return {
        message: `Product creation failed. Required fields are missing`,
        data: missingFields,
      };
    }

    try {
      const productData = await prisma.product.create({
        data: product,
      });

      return {
        message: 'Product created successfully',
        data: productData,
      };
    } catch (error) {
      return {
        message: 'An error occurred during product creation.',
        data: null,
      };
    }
  }

  async update(id: number, updatedProductData: any) {
    // If the ID is null or undefined, return an error message
    if (id === null || id === undefined) {
      return {
        message: 'Update product failed. ID is null or undefined.',
        data: null,
      };
    }

    // If the request body is empty, return an error message
    if (!updatedProductData || Object.keys(updatedProductData).length === 0) {
      return {
        message: 'Update product failed. Request body is empty.',
        data: null,
      };
    }

    try {
      const existingProduct = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      // If the product with the specified ID does not exist, return an error message
      if (!existingProduct) {
        return {
          message: `Product with ID ${id} does not exist. Update failed.`,
          data: null,
        };
      }

      const updatedProduct = await prisma.product.update({
        where: {
          id,
        },
        data: updatedProductData,
      });

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        message: 'An error occurred while updating the product.',
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
      const existingProduct = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!existingProduct) {
        return {
          message: `Product with ID ${id} does not exist. Deletion failed.`,
          data: null,
        };
      }

      const deletedProduct = await prisma.product.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Product deleted successfully',
        data: {
          id: deletedProduct.id,
        },
      };
    } catch (error) {
      return {
        message: 'An error occurred during product deletion.',
        data: null,
      };
    }
  }

  async updateActivity(id: number) {
    // If the ID is null or undefined, return an error message
    if (id === null || id === undefined) {
      return {
        message: 'Product activity update failed. ID is null or undefined.',
        data: null,
      };
    }

    try {
      const existingProduct = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!existingProduct) {
        return {
          message: `Product with ID ${id} does not exist. Activity update failed.`,
          data: null,
        };
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          active: !existingProduct.active,
        },
      });

      return {
        message: 'Product active state updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      return {
        message:
          'An error occurred while trying to update the product active state.',
        data: null,
      };
    }
  }
}
