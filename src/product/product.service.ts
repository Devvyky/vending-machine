import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepositoryInterface } from './interface/product.repository.interface';
import { ProductEntity } from './entity/product.entity';
import {
  BuyProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
} from './product.dtos';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DeepPartial, EntityManager } from 'typeorm';
import { UserRepositoryInterface } from 'src/user/interface/user.repository.interface';
import { PurchaseRepositoryInterface } from './interface/purchase.repository.interface';
import { PurchaseEntity } from './entity/purchase.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PurchaseRepositoryInterface')
    private readonly purchaseRepository: PurchaseRepositoryInterface,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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

  async buyProduct(
    user: UserEntity,
    productId: string,
    payload: BuyProductDTO,
  ): Promise<{
    totalSpent: number;
    purchasedProduct: PurchaseEntity;
    change: number[];
  }> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (payload.quantity > product.amountAvailable) {
      throw new BadRequestException('Not enough item in stock');
    }
    const totalCost = payload.quantity * product.cost;

    if (totalCost > user.deposit) {
      throw new HttpException(
        'Insufficient funds to purchase this product',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        try {
          const updatedProduct = this.productRepository.merge(product, {
            amountAvailable: product.amountAvailable - payload.quantity,
          });

          const updatedUser = this.userRepository.merge(user, {
            deposit: user.deposit - totalCost,
          });

          const purchaseRecord: DeepPartial<PurchaseEntity> = {
            totalCost,
            quantity: payload.quantity,
            user,
            userId: user.id,
            product,
            productId: product.id,
          };

          await transactionManager.save(ProductEntity, updatedProduct);
          await transactionManager.save(UserEntity, updatedUser);
          const purchase = await transactionManager.save(
            PurchaseEntity,
            purchaseRecord,
          );

          const change = updatedUser.deposit;
          const coins = this._calculateChangeInCoins(change);

          return {
            totalSpent: totalCost,
            purchasedProduct: purchase,
            change: coins,
          };
        } catch (err) {
          throw new BadRequestException(
            'An error occurred with this purchase, please try again',
          );
        }
      },
    );
  }

  private _calculateChangeInCoins(change: number): number[] {
    const coinValues = [100, 50, 20, 10, 5];
    const result: number[] = [];

    for (const coin of coinValues) {
      const count = Math.floor(change / coin);
      for (let i = 0; i < count; i++) {
        result.push(coin);
      }
      change %= coin;
    }

    return result;
  }
}
