import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCommand, UpdateCommand } from './entities/command.entity';
import { CommandService } from './command.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@Controller('command')
@ApiTags('commands')
export class CommandController {
  constructor(private commandService: CommandService) {}

    @Get("getCommands")
    @ApiOperation({ summary: 'Get all commands', description: 'Retrieves all commands.' })
    @UseGuards(AuthGuard)
    getAllCommands() {
        return this.commandService.findAll();
    }

    @Get('getCommandByFilter')
    @ApiOperation({ summary: 'Get command by filter', description: 'Retrieves a command by the filter specified.' })
    @ApiQuery({ name: 'name', required: true, type: 'string' })
    @ApiQuery({ name: 'value', required: true, type: 'string' })
    @UseGuards(AuthGuard)
    getCommandByFilter(@Query('name') name: string, @Query('value') value: string ){
        const filter = {
            [name]: value
        };
        return this.commandService.findByFilter(filter);
    }

    @Get('getCommand')
    @ApiOperation({ summary: 'Get command by ID', description: 'Retrieves a command by its ID.' })
    @UseGuards(AuthGuard)
    getOne(@Query('id') id: string) {
        return this.commandService.findOne(parseInt(id));
    }

    @Post('create')
    @ApiOperation({ summary: 'Create new command', description: 'Creates a new command.' })
    @ApiBody({ type: CreateCommand })
    @UseGuards(AuthGuard)
    create(@Body() command: CreateCommand, @Request() req){
        const userId = req['user']?.id;
        if (!userId) {
          return { message: 'User ID not found in the token', data: null };
        }
        
        return this.commandService.create(command, userId);
    }

    @Put('update')
    @ApiOperation({ summary: 'Update command', description: 'Updates an existing command.' })
    @ApiQuery({ name: 'id', description: 'ID of the command to update' })
    @ApiBody({ type: UpdateCommand })
    @UseGuards(AuthGuard)
    update(@Query('id') id: string, @Body() updatedCommand: UpdateCommand, @Request() req){
        const userId = req['user']?.id;
        if (!userId) {
          return { message: 'User ID not found in the token', data: null };
        }

        return this.commandService.update(parseInt(id), updatedCommand, userId);
    }
    
    @Post('refunded')
    @ApiOperation({
        summary: 'Refund command',
        description: 'Refunds an existing command by its ID.',
    })
    @ApiQuery({ name: 'id', description: 'ID of the command to refund' })
    refund(@Query('id') id: string) {
        return this.commandService.refund(parseInt(id));
    }
}
