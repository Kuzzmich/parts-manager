import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from '@prisma/client';
import { ContactsService } from './contacts.service';
import { UpdateContactDto } from './dto/update-contact.dto';

@UseGuards(JwtAuthGuard)
@Controller('/clients/:clientId/contact')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  create(
    @Param('clientId') clientId: string,
    @Body() dto: CreateContactDto,
  ): Promise<Contact | never> {
    return this.contactsService.create(clientId, dto);
  }

  @Get()
  find(@Param('clientId') clientId: string): Promise<Contact | never> {
    return this.contactsService.find(clientId);
  }

  @Patch()
  update(
    @Param('clientId') clientId: string,
    @Body() dto: UpdateContactDto,
  ): Promise<Contact | never> {
    return this.contactsService.update({ clientId, payload: dto });
  }

  @Delete()
  delete(@Param('clientId') clientId: string): Promise<Contact | never> {
    return this.contactsService.delete(clientId);
  }
}
