import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowsService {
  async findOne(id: string) {
    // TODO: implement find workflow instance by id
    return { data: { id } };
  }

  async getEvents(workflowId: string) {
    // TODO: implement get events / history for a workflow instance
    return { data: [] };
  }
}
