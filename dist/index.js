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
const fastify_1 = __importDefault(require("fastify"));
const database_1 = __importDefault(require("./database"));
const app = (0, fastify_1.default)({ logger: true });
app.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: 'world' };
}));
database_1.default.$connect().then(() => {
    console.log('Successfully Connected to Database.');
});
const PORT = process.env.PORT;
const start = (PORT) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.listen(PORT);
        console.log(`Server is listening on ${PORT}`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
start(PORT);
