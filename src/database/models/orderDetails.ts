import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import Order from './order';
import Product from './product';

@Table({
  tableName: 'orderdetails',
  modelName: 'OrderDetail',
  timestamps: true
})
class OrderDetail extends Model {

  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  declare orderId: string;

  @BelongsTo(() => Order)
  declare order: Order;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @BelongsTo(() => Product)
  declare product: Product;
}

export default OrderDetail;
