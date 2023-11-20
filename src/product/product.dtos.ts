import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { IsMultipleOf, IsValidNumeric } from 'src/shared/decorators/validators';
import { UserEntity } from 'src/user/entity/user.entity';

export class CreateProductDTO {
  @IsPositive()
  @IsNotEmpty()
  amountAvailable: number;

  @IsNumber()
  @IsNotEmpty()
  @IsMultipleOf(5, { message: 'Cost must be in multiples of 5' })
  @IsValidNumeric(10, 2)
  cost: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  seller: UserEntity;

  sellerId: string;
}

export class UpdateProductDTO {
  @IsPositive()
  @IsNotEmpty()
  amountAvailable: number;

  @IsPositive()
  @IsNotEmpty()
  @IsMultipleOf(5, { message: 'Cost must be in multiples of 5' })
  @IsValidNumeric(10, 2)
  cost: number;

  @IsString()
  @IsNotEmpty()
  productName: string;
}

export class BuyProductDTO {
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
