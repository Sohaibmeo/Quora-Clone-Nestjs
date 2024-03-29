import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { User } from '../../entity/user.entity';

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsString()
  picture: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsOptional()
  belongsTo: User;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
