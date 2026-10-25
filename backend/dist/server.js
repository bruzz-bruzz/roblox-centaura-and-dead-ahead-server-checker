"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60
});
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN
}));
app.use((0, helmet_1.default)());
app.use(rateLimiter);
app.set('trust proxy', 1);
let centaura = [];
let deadahead = [];
function updateStatus(game) {
    return __awaiter(this, void 0, void 0, function* () {
        let d = process.env.CENTAURA;
        if (game === 'deadahead') {
            d = process.env.DEADAHEAD;
        }
        try {
            const url = `https://games.roblox.com/v1/games/${d}/servers/Public?limit=100`;
            let response = yield axios_1.default.get(url);
            let data = response.data;
            let ret = [];
            for (var x of data.data) {
                ret.push(x);
            }
            let next = data.nextPageCursor;
            while (next !== null) {
                response = yield axios_1.default.get(`${url}&cursor=${next}`);
                data = response.data;
                for (var x of data.data) {
                    ret.push(x);
                }
                next = data.nextPageCursor;
            }
            if (game === 'deadahead') {
                deadahead = ret;
            }
            else {
                centaura = ret;
            }
            return { limit: response.headers['x-ratelimit-reset'] };
        }
        catch (e) {
            return { limit: '60' };
        }
    });
}
function recur() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let limit = yield updateStatus("centaura");
            let limit2 = yield updateStatus("deadahead");
            let delay2 = Math.max(parseInt(limit.limit), parseInt(limit2.limit));
            console.log(delay2 * 1000);
            console.log("UPDATED");
            setTimeout(() => {
                recur();
            }, delay2 * 1000);
        }
        catch (e) {
            console.log("WAIT");
            setTimeout(() => {
                recur();
            }, 60 * 1000);
        }
    });
}
recur();
app.get('/getStatus/:game', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = req.params.game;
    if (game === 'centaura') {
        return res.json({ data: centaura, ok: true, msg: 'success' });
    }
    else if (game === 'deadahead') {
        return res.json({ data: deadahead, ok: true, msg: 'success' });
    }
}));
app.listen(3000);
