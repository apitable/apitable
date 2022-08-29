import { AutomationRunHistoryEntity } from 'entities/automation.run.history.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationRunHistoryEntity)
export class AutomationRunHistoryRepository extends Repository<AutomationRunHistoryEntity> {

  getRunHistoryByRobotId(robotId: string, skip = 0, take = 10) {
    return this.find({
      select: ['taskId', 'robotId', 'createdAt', 'status'],
      where: {
        robotId,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take
    });
  }

  getRunHistoryByTaskId(taskId: string) {
    return this.findOneOrFail({
      where: {
        taskId,
      },
    });
  }

  getRobotRunTimesBySpaceId(spaceId: string) {
    return this.count(
      {
        where: {
          spaceId,
        },
      },
    );
  }
}
