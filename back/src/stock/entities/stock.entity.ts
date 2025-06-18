import { Store } from '../../store/entities/store.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventoryItem } from '../../inventory-items/entities/inventory-item.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentTotalQuantity: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Store, (store) => store.stock)
  store: Store;

  @OneToMany(() => InventoryItem, (inventoryItems) => inventoryItems.stock, {
    cascade: true,
  })
  inventoryItems: InventoryItem[];

  calculateCurrentTotalQuantity(): number {
    if (!this.inventoryItems) return 0;
    return this.inventoryItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }
}
