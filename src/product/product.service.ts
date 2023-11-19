import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepositoryInterface } from './interface/product.repository.interface';
import { ProductEntity } from './product.entity';
import { CreateProductDTO, UpdateProductDTO } from './product.dtos';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async getProducts(): Promise<ProductEntity[]> {
    return this.productRepository.findAll({ where: { isDeleted: false } });
  }

  async create(payload: CreateProductDTO): Promise<ProductEntity> {
    return this.productRepository.save(payload);
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return this.productRepository.findByCondition({
      where: { id, isDeleted: false },
      select: [
        'id',
        'amountAvailable',
        'cost',
        'productName',
        'isDeleted',
        'seller',
        'createdAt',
      ],
    });
  }

  async updateProduct(
    user: UserEntity,
    productId: string,
    payload: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const existingProduct = await this.findProductById(productId);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.sellerId === user.id) {
      throw new ForbiddenException('Cannot update other sellers product');
    }

    const updatedProduct = this.productRepository.merge(
      existingProduct,
      payload,
    );

    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(
    user: UserEntity,
    productId: string,
  ): Promise<ProductEntity> {
    const existingProduct = await this.findProductById(productId);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.sellerId === user.id) {
      throw new ForbiddenException('Cannot delete other sellers product');
    }

    const updatedProduct = this.productRepository.merge(existingProduct, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return this.productRepository.save(updatedProduct);
  }
}
