import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  providers: [CommandService, MailService],
  controllers: [CommandController],
})
export class CommandModule {}
