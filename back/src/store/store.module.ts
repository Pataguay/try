import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { User } from '../user/entities/user.entity';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { StockModule } from '../stock/stock.module';
import { InventoryItemsController } from '../inventory-items/inventory-items.controller';
import { InventoryItemsService } from '../inventory-items/inventory-items.service';
import { InventoryItem } from '../inventory-items/entities/inventory-item.entity';
import { Product } from '../products/entities/product.entity';
import { Stock } from '../stock/entities/stock.entity';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, InventoryItem, Product, Stock]),
    ProductsModule,
    StockModule,
    AddressModule,
  ],
  controllers: [StoreController, InventoryItemsController],
  providers: [StoreService, ProductsService, InventoryItemsService],
  exports: [StoreService],
})
export class StoreModule {}
