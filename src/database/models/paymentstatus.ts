import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    HasOne
} from 'sequelize-typescript'
import Order from './order'

@Table({
    tableName:'payments',
    modelName:'Payment',
    timestamps:true
})
class Payment extends Model{

    @PrimaryKey
    @Column({
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.ENUM('cod','khalti','esewa'),
        allowNull:false
    })
    declare paymentMethod:string

    @Column({
        type:DataType.ENUM('paid','unpaid'),
        defaultValue:'unpaid'
    })
    declare paymentStatus:string

    @Column({ type:DataType.STRING })
    declare pidx:string

    @HasOne(() => Order)
    declare order: Order
}

export default Payment
