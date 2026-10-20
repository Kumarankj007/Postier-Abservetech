/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { CronJob } from 'cron'
import { UserController } from '../controllers/Auth/UserController.js'

// const serviceCron = new CronJob({
//   cronTime: '0 */1 * * * *',
//   onTick: function () {
//     console.log('You will see this message every second')
//   },
//   start: true
// })

// eslint-disable-next-line no-unused-vars
const serviceCron = CronJob.from({
  cronTime: '0 */1 * * * *',
  onTick: function () {
    // Restrict the cron run in one instance alone if we use PM2 clusters mode
    if (process.env.pm_id == 0) {
      UserController.userOfflineCron()
      ServiceModuleController.scheduleLaterCron()
      // console.log('EVERY_MINUTE_CRON')
    } else {
      // console.log('EVERY_MINUTE_CRON_BLOCKED')
    }
  },
  start: true
})
