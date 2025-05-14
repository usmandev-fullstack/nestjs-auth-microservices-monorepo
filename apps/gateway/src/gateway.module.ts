import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { NetworkingService } from '../../common/core/networking.service';

@Module({
  imports: [],
  controllers: [GatewayController, AuthController],
  providers: [GatewayService, AuthService, NetworkingService],
})
export class GatewayModule {}
