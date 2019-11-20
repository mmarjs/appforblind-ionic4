import { User } from './user.model';
import { Scene } from './scene.model';
import { Character } from './character.model';
import { Video } from './video.model';

export class Narration {
  _id: string;
  type: string;
  user: User;
  video: Video;
  characters: Character[];
  locations: Location[];
  scenes: Scene[];
}