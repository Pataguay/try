import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('inventory_items')
@Index(['stock', 'product'], { unique: true }) // Garante que um produto não seja duplicado no mesmo estoque
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'datetime', nullable: true })
  restockedAt: Date;

  @ManyToOne(() => Stock, (stock) => stock.inventoryItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @ManyToOne(() => Product, (product) => product.inventoryItems, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  checkAvailability(): boolean {
    return this.quantity > 0;
  }
}
