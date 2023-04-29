import { Router } from 'express'
import SourceScanner from './SourceScanner.service'

class SourceScannerController {
  router = Router()

  constructor () {
    this.initRoutes()
  }

  initRoutes () {
    this.router.post('/SourceScan', SourceScanner.getSourceLinks)
  }
}

export default new SourceScannerController()
