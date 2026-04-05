import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async ask(dto: { prompt: string; context?: Record<string, any> }) {
    // TODO: implement AI workspace ask (send prompt, receive AI output)
    return {
      data: {
        id: 'output-id',
        prompt: dto.prompt,
        response: 'AI response placeholder',
        status: 'pending_review',
        created_at: new Date().toISOString(),
      },
    };
  }

  async getReviewQueue(query: { page?: number; limit?: number }) {
    // TODO: implement get AI outputs pending human review
    return { data: [], meta: { page: query.page || 1, limit: query.limit || 20, total: 0 } };
  }

  async approveOutput(outputId: string) {
    // TODO: implement approve an AI output
    return { data: { id: outputId, status: 'approved', approved_at: new Date().toISOString() } };
  }

  async rejectOutput(outputId: string, dto?: { reason?: string }) {
    // TODO: implement reject an AI output
    return { data: { id: outputId, status: 'rejected', ...dto, rejected_at: new Date().toISOString() } };
  }
}
