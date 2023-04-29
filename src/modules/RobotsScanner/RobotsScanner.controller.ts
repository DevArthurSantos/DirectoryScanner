import { Router } from 'express'
import RobotsScanner from './RobotsScanner.service'

class RobotsScannerController {
  router = Router()

  constructor () {
    this.initRoutes()
  }

  initRoutes () {
    this.router.post('/RobotsScan', RobotsScanner.getRobotsLinks)
  }
}

export default new RobotsScannerController()
