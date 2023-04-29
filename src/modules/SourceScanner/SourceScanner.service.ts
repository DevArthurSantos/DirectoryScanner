import { type Request, type Response } from 'express'
import cheerio from 'cheerio'
import Api from '../../api';
import VerificationService from '../verification/Verification.service';

class SourceScanner {
  constructor() {
    this.getSourceLinks = this.getSourceLinks.bind(this);
  }

  async scanner(urlClenned: string) {
    try {

      const response = await Api.get(urlClenned)
      const html = response.data

      const $ = cheerio.load(html)

      const links = $('a')

      const result: string[] = []
      links.each((index, element) => {
        const href = $(element).attr('href')
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          result.push(href)
        }
      })

      return result

    } catch (error) {
      return []
    }
  }

  async getSourceLinks(req: Request, res: Response): Promise<Response> {
    const { url } = req.body
    const urlClenned = url.endsWith('/') ? url.slice(0, -1) : url
    
    const resultTestURL: { status: number, msg: string } = await VerificationService.verifyUrlValidity(urlClenned)
    if (resultTestURL.status !== 200) {
      return res.json(resultTestURL)
    }
    const { division } = req.query
    const chunks = []

    const result = await this.scanner(urlClenned)

    for (let i = 0; i < result.length; i += Number(division)) {
      const chunk = result.slice(i, i + Number(division))
      chunks.push(chunk)
    }

    return res.json({
      SourceScannerResults: chunks
    })
  }
}

export default new SourceScanner()
