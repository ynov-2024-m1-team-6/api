import { Controller, Get, Post, Body, Param, Put, Delete, UnsupportedMediaTypeException, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Command, CreateCommand, UpdateCommand } from './entities/command.entity';
import { CommandService } from './command.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { parse } from 'path';

@ApiBearerAuth()
@Controller('command')
@ApiTags('commands') // Tags pour regrouper les opérations liées aux commandes dans Swagger
export class CommandController {
    constructor(private commandService: CommandService) {}

    @Get("getCommands")
    @ApiOperation({ summary: 'Get all commands', description: 'Retrieves all commands.' })
    getAllCommands() {
        return this.commandService.findAll();
    }


    @Get('getCommandByOrderNumber')
    @ApiOperation({ summary: 'Get command by order number', description: 'Retrieves a command by its order number.' })
    @ApiQuery({ name: 'orderNumber', required: true, type: 'string' })
    getCommandByOrderNumber(@Query('orderNumber') orderNumber: string) {
        return this.commandService.findByOrderNumber(orderNumber);
    }

    @Get('getCommand')
    @ApiOperation({ summary: 'Get command by ID', description: 'Retrieves a command by its ID.' })
    getOne(@Query('id') id: string) {
        return this.commandService.findOne(parseInt(id));
    }

    @Post('create')
    @ApiOperation({ summary: 'Create new command', description: 'Creates a new command.' })
    @ApiBody({ type: CreateCommand })
    @UseGuards(AuthGuard)
    create(@Body() command: CreateCommand, @Request() req){
        const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
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
        const userId = req['user']?.id; // Récupérer l'ID du token depuis la requête
        if (!userId) {
          return { message: 'User ID not found in the token', data: null };
        }


        return this.commandService.update(parseInt(id), updatedCommand, userId);
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete command', description: 'Deletes an existing command by its ID.' })
    @ApiQuery({ name: 'id', description: 'ID of the command to delete' })
    delete(@Query('id') id: string) {
        return this.commandService.delete(parseInt(id));
    }
}
