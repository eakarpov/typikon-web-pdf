import express, {Response, Request} from "express";
import dotenv from "dotenv";
import * as path from "path";
import cors, {CorsOptions} from "cors";
import onSave from "./pdf/service";
import bodyParser from "body-parser";

dotenv.config({ path: path.resolve(
    __dirname,
        process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.development"
    )
});

const app = express();
app.use(bodyParser.json());

const allowlist = [`https://${process.env.TYPIKON_WEB}`, `https://www.${process.env.TYPIKON_WEB}`];

const corsOptionsDelegate = function (req: cors.CorsRequest, callback: (err: Error | null, options?: CorsOptions) => void) {
    let corsOptions;
    if (allowlist.indexOf(req.headers.origin || "") !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(process.env.NODE_ENV === "production" ? corsOptionsDelegate : {}));

app.post('/pdf', async (req: Request, res: Response) => {
    const text = req.body as any;
    console.log(text);
    if (!text) {
        res.status(400).end();
        return;
    }
    try {
        const pdfBytes = await onSave(text);
        const buffer = Buffer.from(pdfBytes);
        res.status(200).send(buffer);
    } catch (e) {
        console.log(e);
        res.status(400).end();
    }
});

app.listen(process.env.PORT);
