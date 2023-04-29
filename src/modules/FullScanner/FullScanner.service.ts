import { type Request, type Response } from 'express'
import RobotsScannerService from '../RobotsScanner/RobotsScanner.service'
import SourceScannerService from '../SourceScanner/SourceScanner.service'
import VerificationService from '../verification/Verification.service';
import WordListScannerService from '../WordListScanner/WordListScanner.service'

class FullScanner {

  constructor() {
    this.getFullScanner = this.getFullScanner.bind(this);
  }

  async getFullScanner(req: Request, res: Response): Promise<Response> {
    const { url } = req.body
    const { timeout, division } = req.query
    const urlClenned = url.endsWith('/') ? url.slice(0, -1) : url

    const resultTestURL: { status: number, msg: string } = await VerificationService.verifyUrlValidity(urlClenned)
    if (resultTestURL.status !== 200) {
      return res.json(resultTestURL)
    }

    const chunksRobots = []
    const chunksScanner = []
    const chunksWordList = []

    const RobotsScanner = await RobotsScannerService.scanner(urlClenned)
    const SourceScanner = await SourceScannerService.scanner(urlClenned)
    const WordListScanner = await WordListScannerService.scanner(urlClenned, Number(timeout))


    for (let i = 0; i < RobotsScanner.RobotsScannerResults.length; i += Number(division)) {
      const chunk = RobotsScanner.RobotsScannerResults.slice(i, i + Number(division))
      chunksRobots.push(chunk)
    }
    for (let i = 0; i < SourceScanner.length; i += Number(division)) {
      const chunk = SourceScanner.slice(i, i + Number(division))
      chunksScanner.push(chunk)
    }
    for (let i = 0; i < WordListScanner.length; i += Number(division)) {
      const chunk = WordListScanner.slice(i, i + Number(division))
      chunksWordList.push(chunk)
    }

    const filteredObj = this.filterRepeatedWords({
      chunksRobots,
      chunksScanner,
      chunksWordList
    });

    return res.send(filteredObj)
  }

  filterRepeatedWords(obj: any) {
    for (const key in obj) {
      obj[key] = obj[key].map((arr: any) => [...new Set(arr)]);
    }
    return obj;
  };
}

export default new FullScanner()
