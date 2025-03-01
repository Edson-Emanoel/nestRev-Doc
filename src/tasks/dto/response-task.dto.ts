export class ResponseTaskDto {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
