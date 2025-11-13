// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';

export default class Note extends Model {
  static table = 'notes';
  @field('title') title;
  @field('desc') desc;
  @readonly @date('created_at') createdAt;
}
