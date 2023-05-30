/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Listen to 'active' event.
 *
 * This event is triggered when a job enters the 'active' state.
 */
export const ON_ACTIVE = 'active';
/**
 * Listen to 'added' event.
 *
 * This event is triggered when a job is created.
 */
export const ON_ADDED = 'added';
/**
 * Listen to 'cleaned' event.
 *
 * This event is triggered when a cleaned method is triggered.
 */
export const ON_CLEANED = 'cleaned';
/**
 * Listen to 'completed' event.
 *
 * This event is triggered when a job has successfully completed.
 */
export const ON_COMPLETED = 'completed';
/**
 * Listen to 'delayed' event.
 *
 * This event is triggered when a job is delayed.
 */
export const ON_DELAYED = 'delayed';
/**
 * Listen to 'drained' event.
 *
 * This event is triggered when the queue has drained the waiting list.
 * Note that there could still be delayed jobs waiting their timers to expire
 * and this event will still be triggered as long as the waiting list has emptied.
 */
export const ON_DRAINED = 'drained';
/**
 * Listen to 'duplicated' event.
 *
 * This event is triggered when a job is not created because it already exist.
 */
export const ON_DUPLICATED = 'duplicated';
/**
 * Listen to 'error' event.
 *
 * This event is triggered when an exception is thrown.
 */
export const ON_ERROR = 'error';
/**
 * Listen to 'failed' event.
 *
 * This event is triggered when a job has thrown an exception.
 */
export const ON_FAILED = 'failed';
/**
 * Listen to 'paused' event.
 *
 * This event is triggered when a queue is paused.
 */
export const ON_PAUSED = 'paused';
/**
 * Listen to 'progress' event.
 *
 * This event is triggered when a job updates it progress, i.e. the
 * Job##updateProgress() method is called. This is useful to notify
 * progress or any other data from within a processor to the rest of the
 * world.
 */
export const ON_PROGRESS = 'progress';
/**
 * Listen to 'removed' event.
 *
 * This event is triggered when a job has been manually
 * removed from the queue.
 */
export const ON_REMOVED = 'removed';
/**
 * Listen to 'resumed' event.
 *
 * This event is triggered when a queue is resumed.
 */
export const ON_RESUMED = 'resumed';
/**
 * Listen to 'retries-exhausted' event.
 *
 * This event is triggered when a job has retried the maximum attempts.
 */
export const ON_RETRIES_EXHAUSTED = 'retries-exhausted';
/**
 * Listen to 'stalled' event.
 *
 * This event is triggered when a job has been moved from 'active' back
 * to 'waiting'/'failed' due to the processor not being able to renew
 * the lock on the said job.
 */
export const ON_STALLED = 'stalled';
/**
 * Listen to 'waiting' event.
 *
 * This event is triggered when a job enters the 'waiting' state.
 */
export const ON_WAITING = 'waiting';
/**
 * Listen to 'waiting-children' event.
 *
 * This event is triggered when a job enters the 'waiting-children' state.
 */
export const ON_WAITING_CHILDREN = 'waiting-children';
