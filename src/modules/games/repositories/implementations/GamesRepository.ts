import { getConnection, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where(`games.title ILIKE LOWER('%${param}%')`)
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return getConnection()
      .getRepository(User)
      .createQueryBuilder("users")
      .leftJoin("users.games", "games")
      .where(`games.id = '${id}'`)
      .getMany();
  }
}
