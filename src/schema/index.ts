import type { GameSchema } from './types'
import { POE1_SCHEMA } from './poe1'
import { POE2_SCHEMA } from './poe2'

export function schemaForVersion(version: 1 | 2): GameSchema {
  return version === 2 ? POE2_SCHEMA : POE1_SCHEMA
}
