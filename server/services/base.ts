import { db } from '../database/client'

export class BaseService {
  protected db = db
}
