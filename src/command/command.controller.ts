import { Controller, Get, Post, Body, Param, Put, Delete, UnsupportedMediaTypeException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Command, CreateCommand, UpdateCommand } from './entities/command.entity';
import { CommandService } from './command.service';
import { createCipheriv } from 'crypto';

@Controller('command')
@ApiTags('commands') // Tags pour regrouper les opérations liées aux commandes dans Swagger
export class CommandController {
    constructor(private commandService: CommandService) {}

    @Get("getCommands")
    @ApiOperation({ summary: 'Get all commands', description: 'Retrieves all commands.' })
    getAllCommands() {
        return this.commandService.findAll();
    }

    @Get('getCommand')
    @ApiOperation({ summary: 'Get command by ID', description: 'Retrieves a command by its ID.' })
    getOne(@Query('id') id: number) {
        return this.commandService.findOne(id);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create new command', description: 'Creates a new command.' })
    @ApiBody({ type: CreateCommand })
    create(@Body() command: CreateCommand) {
        return this.commandService.create(command);
    }

    @Put('update')
    @ApiOperation({ summary: 'Update command', description: 'Updates an existing command.' })
    @ApiQuery({ name: 'id', description: 'ID of the command to update' })
    @ApiBody({ type: UpdateCommand })
    update(@Query('id') id: string, @Body() updatedCommand: UpdateCommand) {
        return this.commandService.update(parseInt(id), updatedCommand);
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete command', description: 'Deletes an existing command by its ID.' })
    @ApiQuery({ name: 'id', description: 'ID of the command to delete' })
    delete(@Query('id') id: string) {
        return this.commandService.delete(parseInt(id));
    }
}
