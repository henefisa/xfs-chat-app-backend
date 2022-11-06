import { IsString } from 'class-validator';

export class SearchFriendDto {
  @IsString()
  name: string;
}
