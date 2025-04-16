import { UpdateClientOptions } from './types/options';
import { UpdateClient } from './Update';

export function createClient(
  updateApiKey: string,
  options: UpdateClientOptions
): UpdateClient {
  return new UpdateClient(updateApiKey, options);
}
