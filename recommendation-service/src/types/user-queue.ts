import { UserFilterEntity } from 'src/user-filter/entity/user-filter.entity';

export type UserQueue = {
  userFilter: UserFilterEntity['filter'] | null;
  lastRecommendationId: number | null;
};
