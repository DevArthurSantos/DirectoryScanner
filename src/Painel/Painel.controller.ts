import { Router } from 'express'
import Painel from './Painel.service'

class PainelController {
  router = Router()

  constructor () {
    this.initRoutes()
  }

  initRoutes () {
    this.router.get('/Painel', Painel.openPainel)
  }
}

export default new PainelController()
