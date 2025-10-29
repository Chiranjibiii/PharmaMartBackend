"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 3000;
const app = (0, express_1.default)();
require("./model/index");
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/about", (req, res) => {
    res.send("Hello this is about");
});
app.listen(port, () => {
    console.log(`The server is running at port ${port}`);
});
//# sourceMappingURL=app.js.map