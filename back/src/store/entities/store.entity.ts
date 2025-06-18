import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProducerProfile } from '../../user/entities/producer-profile.entity';
import { Product } from '../../products/entities/product.entity';
import { Stock } from '../../stock/entities/stock.entity';
import { Order } from '../../orders/entities/order.entity'; // Adicionar importação

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  rating: number;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => ProducerProfile, (producerProfile) => producerProfile.stores)
  producerProfile: ProducerProfile;

  @OneToOne(() => Stock, (stock) => stock.store, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @OneToMany(() => Order, (order) => order.store) // Adicionar relacionamento
  orders: Order[];
}
