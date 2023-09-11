import { ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export interface IGqlContext extends ExecutionContext {
  user?: User; // Add your custom property here, such as the user object
  // Add other custom properties if needed
}
