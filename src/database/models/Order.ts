import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import OrderDetail from './orderDetails';
import Payment from './paymentstatus';


@Table({
  tableName: 'orders',
  modelName: 'Order',
  timestamps: true
})
class Order extends Model {

  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phoneNumber: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare shippingAddress: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.ENUM('pending','cancelled','delivered','ontheway','preparation'), defaultValue:'pending' })
  declare orderStatus: string;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID, allowNull:true })
  declare paymentId: string;

  @BelongsTo(() => Payment)
  declare payment: Payment;

  @HasMany(() => OrderDetail)
  declare orderDetails: OrderDetail[];
}

export default Order;
