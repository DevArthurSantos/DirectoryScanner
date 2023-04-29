"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var import_express6 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/modules/FullScanner/FullScanner.controller.ts
var import_express = require("express");

// src/api/index.ts
var import_axios = __toESM(require("axios"));
var import_http = require("http");
var import_https = require("https");
var import_axios_retry = __toESM(require("axios-retry"));
var httpAgent = new import_http.Agent({
  keepAlive: true,
  keepAliveMsecs: 3e4,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 6e4
});
var httpsAgent = new import_https.Agent({
  keepAlive: true,
  keepAliveMsecs: 3e4,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 6e4
});
var Api = import_axios.default.create({
  httpAgent,
  httpsAgent,
  headers: { "Accept-Encoding": "gzip" }
});
(0, import_axios_retry.default)(Api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1e3;
  }
});
var api_default = Api;

// src/modules/verification/Verification.service.ts
var Verification = class {
  constructor() {
    this.verifyUrlValidity = this.verifyUrlValidity.bind(this);
  }
  verifyUrlValidity(url) {
    return __async(this, null, function* () {
      const isValidUrl = url.toLocaleLowerCase().startsWith("http://") ? url : url.toLocaleLowerCase().startsWith("https://") ? url : false;
      if (!isValidUrl) {
        return {
          status: 400,
          msg: "Informe um protocolo http ou https!"
        };
      }
      try {
        const response = yield api_default.get(url);
        if (response.status === 200) {
          return {
            status: 200,
            msg: ""
          };
        } else {
          return {
            status: 400,
            msg: "`URL invalida."
          };
        }
      } catch (error) {
        return {
          status: 400,
          msg: "`URL invalida."
        };
      }
    });
  }
};
var Verification_service_default = new Verification();

// src/modules/RobotsScanner/RobotsScanner.service.ts
var RobotsScanner = class {
  constructor() {
    this.getRobotsLinks = this.getRobotsLinks.bind(this);
  }
  scanner(urlClenned) {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        const response = yield api_default.get(`${urlClenned}/robots.txt`);
        const robotsTxt = response.data;
        const regex = /(Disallow|Allow):\s*(.*)/g;
        const Sitemap = /(Sitemap):\s*(.*)/g;
        const filteredParams = new Set((_a = robotsTxt.match(regex)) == null ? void 0 : _a.map((p) => `${urlClenned}${p.split(": ")[1]}`));
        const urls = Array.from(filteredParams);
        const checkSitemap = new Set((_b = robotsTxt.match(Sitemap)) == null ? void 0 : _b.forEach((p) => {
          urls.push(`${p.split(": ")[1]}`);
        }));
        return {
          RobotsScannerResults: urls
        };
      } catch (error) {
        return {
          RobotsScannerResults: ["A URL informada n\xE3o possui o diret\xF3rio robots.txt"]
        };
      }
    });
  }
  getRobotsLinks(req, res) {
    return __async(this, null, function* () {
      const { url } = req.body;
      const urlClenned = url.endsWith("/") ? url.slice(0, -1) : url;
      const resultTestURL = yield Verification_service_default.verifyUrlValidity(urlClenned);
      if (resultTestURL.status !== 200) {
        return res.json(resultTestURL);
      }
      const { division } = req.query;
      const chunks = [];
      const urls = yield this.scanner(urlClenned);
      for (let i = 0; i < urls.RobotsScannerResults.length; i += Number(division)) {
        const chunk = urls.RobotsScannerResults.slice(i, i + Number(division));
        chunks.push(chunk);
      }
      return res.json({
        RobotsScannerResults: chunks.length === 1 ? chunks[0] : chunks
      });
    });
  }
};
var RobotsScanner_service_default = new RobotsScanner();

// src/modules/SourceScanner/SourceScanner.service.ts
var import_cheerio = __toESM(require("cheerio"));
var SourceScanner = class {
  constructor() {
    this.getSourceLinks = this.getSourceLinks.bind(this);
  }
  scanner(urlClenned) {
    return __async(this, null, function* () {
      try {
        const response = yield api_default.get(urlClenned);
        const html = response.data;
        const $ = import_cheerio.default.load(html);
        const links = $("a");
        const result = [];
        links.each((index, element) => {
          const href = $(element).attr("href");
          if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
            result.push(href);
          }
        });
        return result;
      } catch (error) {
        return [];
      }
    });
  }
  getSourceLinks(req, res) {
    return __async(this, null, function* () {
      const { url } = req.body;
      const urlClenned = url.endsWith("/") ? url.slice(0, -1) : url;
      const resultTestURL = yield Verification_service_default.verifyUrlValidity(urlClenned);
      if (resultTestURL.status !== 200) {
        return res.json(resultTestURL);
      }
      const { division } = req.query;
      const chunks = [];
      const result = yield this.scanner(urlClenned);
      for (let i = 0; i < result.length; i += Number(division)) {
        const chunk = result.slice(i, i + Number(division));
        chunks.push(chunk);
      }
      return res.json({
        SourceScannerResults: chunks
      });
    });
  }
};
var SourceScanner_service_default = new SourceScanner();

// src/modules/WordListScanner/WordListScanner.service.ts
var import_fs = require("fs");
var URLChecker = class {
  constructor() {
    this.getWordListLinks = this.getWordListLinks.bind(this);
  }
  scanner(urlClenned, timeout) {
    return __async(this, null, function* () {
      const wordlist = (0, import_fs.readFileSync)(`${__dirname}/wordlist.txt`, "utf-8").split("\n").map((line) => line.replace("\r", "").trim());
      const results = [];
      const promises = wordlist.map((parametro) => __async(this, null, function* () {
        function checkUrl(url) {
          return __async(this, null, function* () {
            try {
              const response = yield api_default.get(url);
              return response.status === 200;
            } catch (error) {
              return false;
            }
          });
        }
        const success = yield checkUrl(`${urlClenned}/${parametro}`);
        if (success) {
          results.push(`${urlClenned}/${parametro}`);
        }
        return null;
      }));
      const newTimer = timeout < 5e3 ? Number(999999999) : Number(timeout);
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, newTimer);
      });
      yield Promise.race([Promise.all(promises), timeoutPromise]);
      return results;
    });
  }
  getWordListLinks(req, res) {
    return __async(this, null, function* () {
      const { url } = req.body;
      const urlClenned = url.endsWith("/") ? url.slice(0, -1) : url;
      const resultTestURL = yield Verification_service_default.verifyUrlValidity(urlClenned);
      if (resultTestURL.status !== 200) {
        return res.json(resultTestURL);
      }
      const { timeout, division } = req.query;
      const chunks = [];
      const urls = yield this.scanner(urlClenned, Number(timeout));
      for (let i = 0; i < urls.length; i += Number(division)) {
        const chunk = urls.slice(i, i + Number(division));
        chunks.push(chunk);
      }
      return res.json({
        WordListScannerResults: chunks
      });
    });
  }
};
var WordListScanner_service_default = new URLChecker();

// src/modules/FullScanner/FullScanner.service.ts
var FullScanner = class {
  constructor() {
    this.getFullScanner = this.getFullScanner.bind(this);
  }
  getFullScanner(req, res) {
    return __async(this, null, function* () {
      const { url } = req.body;
      const { timeout, division } = req.query;
      const urlClenned = url.endsWith("/") ? url.slice(0, -1) : url;
      const resultTestURL = yield Verification_service_default.verifyUrlValidity(urlClenned);
      if (resultTestURL.status !== 200) {
        return res.json(resultTestURL);
      }
      const chunksRobots = [];
      const chunksScanner = [];
      const chunksWordList = [];
      const RobotsScanner2 = yield RobotsScanner_service_default.scanner(urlClenned);
      const SourceScanner2 = yield SourceScanner_service_default.scanner(urlClenned);
      const WordListScanner = yield WordListScanner_service_default.scanner(urlClenned, Number(timeout));
      for (let i = 0; i < RobotsScanner2.RobotsScannerResults.length; i += Number(division)) {
        const chunk = RobotsScanner2.RobotsScannerResults.slice(i, i + Number(division));
        chunksRobots.push(chunk);
      }
      for (let i = 0; i < SourceScanner2.length; i += Number(division)) {
        const chunk = SourceScanner2.slice(i, i + Number(division));
        chunksScanner.push(chunk);
      }
      for (let i = 0; i < WordListScanner.length; i += Number(division)) {
        const chunk = WordListScanner.slice(i, i + Number(division));
        chunksWordList.push(chunk);
      }
      return res.send({
        RobotsScanner: chunksRobots,
        SourceScanner: chunksScanner,
        WordListScanner: chunksWordList
      });
    });
  }
};
var FullScanner_service_default = new FullScanner();

// src/modules/FullScanner/FullScanner.controller.ts
var FullScannerController = class {
  constructor() {
    this.router = (0, import_express.Router)();
    this.initRoutes();
  }
  initRoutes() {
    return __async(this, null, function* () {
      this.router.post("/FullScan", FullScanner_service_default.getFullScanner);
    });
  }
};
var FullScanner_controller_default = new FullScannerController();

// src/modules/RobotsScanner/RobotsScanner.controller.ts
var import_express2 = require("express");
var RobotsScannerController = class {
  constructor() {
    this.router = (0, import_express2.Router)();
    this.initRoutes();
  }
  initRoutes() {
    this.router.post("/RobotsScan", RobotsScanner_service_default.getRobotsLinks);
  }
};
var RobotsScanner_controller_default = new RobotsScannerController();

// src/modules/SourceScanner/SourceScanner.controller.ts
var import_express3 = require("express");
var SourceScannerController = class {
  constructor() {
    this.router = (0, import_express3.Router)();
    this.initRoutes();
  }
  initRoutes() {
    this.router.post("/SourceScan", SourceScanner_service_default.getSourceLinks);
  }
};
var SourceScanner_controller_default = new SourceScannerController();

// src/modules/WordListScanner/WordListScanner.controller.ts
var import_express4 = require("express");
var WordListScannerController = class {
  constructor() {
    this.router = (0, import_express4.Router)();
    this.initRoutes();
  }
  initRoutes() {
    this.router.post("/WordListScan", WordListScanner_service_default.getWordListLinks);
  }
};
var WordListScanner_controller_default = new WordListScannerController();

// src/Painel/Painel.controller.ts
var import_express5 = require("express");

// src/Painel/Painel.service.ts
var Painel = class {
  constructor() {
    this.openPainel = this.openPainel.bind(this);
  }
  openPainel(req, res) {
    return __async(this, null, function* () {
      return res.sendFile(__dirname + "/index.html");
    });
  }
};
var Painel_service_default = new Painel();

// src/Painel/Painel.controller.ts
var PainelController = class {
  constructor() {
    this.router = (0, import_express5.Router)();
    this.initRoutes();
  }
  initRoutes() {
    this.router.get("/Painel", Painel_service_default.openPainel);
  }
};
var Painel_controller_default = new PainelController();

// src/app.ts
var App = class {
  constructor() {
    this.express = (0, import_express6.default)();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use((0, import_express6.json)());
    this.express.use((0, import_cors.default)({
      allowedHeaders: ["Access-Control-Allow-Origin", "*"],
      origin: true
    }));
  }
  routes() {
    this.express.use(SourceScanner_controller_default.router);
    this.express.use(RobotsScanner_controller_default.router);
    this.express.use(WordListScanner_controller_default.router);
    this.express.use(FullScanner_controller_default.router);
    this.express.use(Painel_controller_default.router);
  }
  listen(port) {
    this.express.listen(port, () => {
      console.log("Server listening");
    });
  }
};
var app_default = new App();

// src/server.ts
app_default.listen(3e3 /* PORT */);
