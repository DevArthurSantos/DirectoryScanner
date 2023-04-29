import { Router } from 'express'
import FullScanner from './FullScanner.service'

class FullScannerController {
  router = Router()

  constructor () {
    this.initRoutes()
  }

  async initRoutes () {
    this.router.post('/FullScan', FullScanner.getFullScanner)
  }
}

export default new FullScannerController()
