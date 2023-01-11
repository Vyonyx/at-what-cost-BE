"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const filters_1 = __importDefault(require("./routes/filters"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3333;
const app = (0, express_1.default)();
/* Configuration */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/* Routes */
app.use('/filters', filters_1.default);
app.get('/greet', (req, res) => {
    return res.send('Hello');
});
app.get('/', (req, res) => {
    return res.send('Server is up & running.');
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map