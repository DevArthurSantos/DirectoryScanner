import { type Request, type Response } from 'express'
import Api from '../../api';
import VerificationService from '../verification/Verification.service';

class RobotsScanner {
  constructor() {
    this.getRobotsLinks = this.getRobotsLinks.bind(this);
  }

  async scanner(urlClenned: string) {
    try {
      const response = await Api.get(`${urlClenned}/robots.txt`)

      const robotsTxt = response.data

      const regex = /(Disallow|Allow):\s*(.*)/g
      const Sitemap = /(Sitemap):\s*(.*)/g

      const filteredParams = new Set(robotsTxt.match(regex)?.map((p: string) => `${urlClenned}${p.split(': ')[1]}`))
      const urls = Array.from(filteredParams)

      const checkSitemap = new Set(robotsTxt.match(Sitemap)?.forEach((p: string) => {
        urls.push(`${p.split(': ')[1]}`)
      }))

      return {
        RobotsScannerResults: urls
      }
    } catch (error) {
      return {
        RobotsScannerResults: ['A URL informada não possui o diretório robots.txt']
      }
    }
  }

  async getRobotsLinks(req: Request, res: Response): Promise<Response> {
    const { url } = req.body
    const urlClenned = url.endsWith('/') ? url.slice(0, -1) : url

    const resultTestURL: { status: number, msg: string } = await VerificationService.verifyUrlValidity(urlClenned)
    if (resultTestURL.status !== 200) {
      return res.json(resultTestURL)
    }

    const { division } = req.query
    const chunks = []

    const urls = await this.scanner(urlClenned)

    for (let i = 0; i < urls.RobotsScannerResults.length; i += Number(division)) {
      const chunk = urls.RobotsScannerResults.slice(i, i + Number(division))
      chunks.push(chunk)
    }

    return res.json({
      RobotsScannerResults: chunks.length === 1 ? chunks[0] : chunks
    })
  }
}

export default new RobotsScanner()
