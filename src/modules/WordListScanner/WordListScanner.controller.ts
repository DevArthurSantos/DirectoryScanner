import { Router } from 'express'
import WordListScanner from './WordListScanner.service'

class WordListScannerController {
  router = Router()

  constructor () {
    this.initRoutes()
  }

  initRoutes () {
    this.router.post('/WordListScan', WordListScanner.getWordListLinks)
  }
}

export default new WordListScannerController()
