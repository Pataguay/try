import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    StoreModule,
    ProductsModule,
    StockModule,
    InventoryItemsModule,
    CartModule,
    AddressModule,
    OrdersModule,
    FavoritesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
