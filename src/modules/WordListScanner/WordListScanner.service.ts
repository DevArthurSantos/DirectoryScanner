import { type Request, type Response } from 'express'
import { readFileSync } from 'fs'
import Api from '../../api';
import VerificationService from '../verification/Verification.service';

class URLChecker {

  constructor() {
    this.getWordListLinks = this.getWordListLinks.bind(this);
  }

  async scanner(urlClenned: string, timeout: number) {
    const wordlist = readFileSync(`${__dirname}/wordlist.txt`, 'utf-8').split('\n').map(line => line.replace('\r', '').trim())

    const results: string[] = []
    const promises = wordlist.map(async (parametro) => {
      async function checkUrl(url: string): Promise<boolean> {
        try {
          const response = await Api.get(url)
          return response.status === 200
        } catch (error) {
          return false
        }
      }

      const success = await checkUrl(`${urlClenned}/${parametro}`)
      if (success) {
        results.push(`${urlClenned}/${parametro}`)
      }
      return null
    })

    const newTimer: number = timeout < 5000 ? Number(999999999) : Number(timeout)
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, newTimer)
    })

    await Promise.race([Promise.all(promises), timeoutPromise])
    return results
  }


  async getWordListLinks(req: Request, res: Response): Promise<Response> {
    const { url } = req.body
    const urlClenned = url.endsWith('/') ? url.slice(0, -1) : url
    
    const resultTestURL: { status: number, msg: string } = await VerificationService.verifyUrlValidity(urlClenned)
    if (resultTestURL.status !== 200) {
      return res.json(resultTestURL)
    }
    const { timeout, division } = req.query
    const chunks = []

    const urls = await this.scanner(urlClenned, Number(timeout))

    for (let i = 0; i < urls.length; i += Number(division)) {
      const chunk = urls.slice(i, i + Number(division))
      chunks.push(chunk)
    }

    return res.json({
      WordListScannerResults: chunks
    })
  }
}

export default new URLChecker()
