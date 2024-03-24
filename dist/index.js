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
const category_1 = require("./routes/category");
const product_1 = require("./routes/product");
database_1.default.$connect().then(() => {
    console.log('Successfully Connected to Database.');
});
const build = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, fastify_1.default)({ logger: true });
    app.register(category_1.categoryRoutes);
    app.register(product_1.productRoutes);
    return app;
});
const PORT = process.env.PORT;
const start = (PORT) => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield build();
    app.listen({ port: PORT, host: '127.0.0.1' })
        .then(() => {
        console.log(`Server is listening on ${PORT}`);
    })
        .catch((err) => {
        console.error('Error starting server:', err);
        process.exit(1);
    });
});
start(PORT);
