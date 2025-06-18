import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ClientProfile } from '../../user/entities/client-profile.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientProfileId: number;

  @Column()
  productId: number;

  @ManyToOne(() => ClientProfile, (clientProfile) => clientProfile.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientProfileId' })
  clientProfile: ClientProfile;

  @ManyToOne(() => Product, (product: Product) => product.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
