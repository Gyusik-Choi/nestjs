import { Body, Controller, Get, Post } from '@nestjs/common';
import { IncomingWebhookSendArguments } from '@slack/client';
import { AppService } from './app.service';
import { NotifyService } from './notify/notify.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notifyService: NotifyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  sendToSlack(@Body() body: any) {
    const args: IncomingWebhookSendArguments = {
      text: body['text'],
    };

    return this.notifyService.notify(args);
  }
}
