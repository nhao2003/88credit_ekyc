import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateEkycRequest } from './dto/create-request.dto';
import { Public } from 'src/core/decorators';
type Paging<T> = {
  page: number;
  items: T[];
};
@Controller('blockchain')
@Public()
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  //#region Admin API endpoints

  /**
   *  Lấy danh sách các tổ chức
   * @param page số trang
   * @returns danh sách các tổ chức
   */
  @Get('admin/organizations')
  async getAllOrganizations(@Query('page') page): Promise<Paging<any>> {
    const res = await this.blockchainService.getAllOrganizations(page || 1);
    return {
      page: res[0],
      items: res[1],
    };
  }

  @Post('admin/organizations')
  async createOrganization(@Body() data: CreateOrganizationDto) {
    return this.blockchainService.addOrganization(data);
  }

  @Patch('admin/organizations/:id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() data: CreateOrganizationDto,
  ) {
    return this.blockchainService.updateOrganizationDetails(
      id,
      data.name,
      data.email,
    );
  }

  @Patch('admin/organizations/:id/activate-deactivate')
  async activateDeactivateOrganization(
    @Param('id') id: string,
    @Body() UpdateOrganizationDto,
  ) {
    return this.blockchainService.activateDeactivateOrganization(
      id,
      UpdateOrganizationDto.isActive,
    );
  }
  //#endregion

  //#region Organization API endpoints
  @Get('organizations/:oid/customers')
  async getOrganizationCustomers(
    @Param('oid') id: string,
    @Query('page') page: number,
  ) {
    const res = await this.blockchainService.getCustomersOfOrganization(
      id,
      page,
    );
    return {
      page: res[0],
      items: res[1],
    };
  }

  @Post('organizations/:oid/request')
  addKycRequest(
    @Param('oid') oid: string,
    @Body()
    data: CreateEkycRequest,
  ) {
    return this.blockchainService.addKycRequest(
      oid,
      data.customer,
      Date.now(),
      data.notes,
    );
  }

  @Post('organizations/:oid/request/:uid/re-request')
  async reRequestForKycRequest(
    @Param('oid') oid: string,
    @Param('uid') uid: string,
    @Body() data: { notes: string },
  ) {
    return this.blockchainService.reRequestForKycRequest(oid, uid, data.notes);
  }

  @Patch('organizations/:oid/customers/:uid')
  async updateKycVerification(
    @Param('oid') oid: string,
    @Param('uid') uid: string,
    @Body() data: { verified: boolean; note: string },
  ) {
    return this.blockchainService.updateKycVerification(
      oid,
      uid,
      data.verified,
      data.note,
    );
  }

  @Get('organizations/:oid/customers/search/:uid')
  async searchCustomers(@Param('oid') oid: string, @Param('uid') uid: string) {
    const res = await this.blockchainService.searchCustomers(oid, uid);
    return {
      found: res[0],
      customers: res[1],
      requests: res[2],
    };
  }

  //#endregion

  //#region Customer API endpoints

  @Get('customers/:uid/organizations')
  async getOrganizationRequests(
    @Query('page') page: number = 1,
    @Param('uid') uid: string,
  ) {
    page = isNaN(page) || Number(page) < 1 ? 1 : page;
    const res = await this.blockchainService.getOrganizationRequests(uid, page);
    return {
      page: res[0],
      items: res[1],
    };
  }

  @Patch('customers/:id/org/:oid/action')
  async actionOnKycRequest(
    @Param('id') id: string,
    @Param('oid') oid: string,
    @Body() data: { approve: boolean; note: string },
  ) {
    return this.blockchainService.actionOnKycRequest(
      id,
      oid,
      data.approve,
      data.note,
    );
  }

  @Post('customers/:id/update-profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() data: { name: string; email: string; mobile: number },
  ) {
    return this.blockchainService.updateProfile(
      id,
      data.name,
      data.email,
      data.mobile,
    );
  }
  @Patch('customers/:id/update-datahash')
  async updateDatahash(
    @Param('id') id: string,
    @Body() data: { hash: string; currentTime: number },
  ) {
    return this.blockchainService.updateDatahash(
      id,
      data.hash,
      data.currentTime,
    );
  }
  @Patch('customers/:id/org/:oid/remove-datahash-permission')
  async removerDatahashPermission(
    @Param('id') id: string,
    @Param('oid') oid: string,
    @Body() data: { notes: string },
  ) {
    return this.blockchainService.removerDatahashPermission(
      id,
      oid,
      data.notes,
    );
  }

  //#endregion

  //#region Common API endpoints

  @Get('who-am-i')
  async whoAmI(@Query('uid') uid: string) {
    return this.blockchainService.whoAmI(uid);
  }

  @Get('organizations/:id')
  async getOrganizationDetails(@Param('id') id: string) {
    return this.blockchainService.getOrganizationDetails(id);
  }

  @Get('customers/:id')
  async searchOrganizations(
    @Param('uid') id: string,
    @Param('oid') oid: string,
  ) {
    return this.blockchainService.searchOrganizations(id, oid);
  }
  //#endregion
}
