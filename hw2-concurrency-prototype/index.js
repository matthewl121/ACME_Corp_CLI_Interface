var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MyBuffer = /** @class */ (function () {
    function MyBuffer(maxSize) {
        this.buffer = [];
        this.maxSize = maxSize;
    }
    MyBuffer.prototype.produce = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.buffer.length === this.maxSize)) return [3 /*break*/, 2];
                        console.log('Buffer is full. Waiting for consumer...');
                        return [4 /*yield*/, this.sleep(100)];
                    case 1:
                        _a.sent(); // Wait for 100ms before checking again
                        return [3 /*break*/, 0];
                    case 2:
                        this.buffer.push(item);
                        console.log("Produced item: ".concat(item));
                        return [2 /*return*/];
                }
            });
        });
    };
    MyBuffer.prototype.consume = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.buffer.length === 0)) return [3 /*break*/, 2];
                        console.log('Buffer is empty. Waiting for producer...');
                        return [4 /*yield*/, this.sleep(100)];
                    case 1:
                        _a.sent(); // Wait for 100ms before checking again
                        return [3 /*break*/, 0];
                    case 2:
                        item = this.buffer.shift();
                        if (item !== undefined) {
                            console.log("Consumed item: ".concat(item));
                        }
                        return [2 /*return*/, item];
                }
            });
        });
    };
    MyBuffer.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return MyBuffer;
}());
var Producer = /** @class */ (function () {
    function Producer(buffer) {
        this.buffer = buffer;
    }
    Producer.prototype.produceItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 3];
                        item = Math.floor(Math.random() * 100);
                        return [4 /*yield*/, this.buffer.produce(item)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sleep(1000)];
                    case 2:
                        _a.sent(); // Produce an item every 1 second
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Producer.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Producer;
}());
var Consumer = /** @class */ (function () {
    function Consumer(buffer) {
        this.buffer = buffer;
    }
    Consumer.prototype.consumeItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.buffer.consume()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sleep(2000)];
                    case 2:
                        _a.sent(); // Consume an item every 2 seconds
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Consumer.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Consumer;
}());
// Usage example
var buffer = new MyBuffer(5);
var producer = new Producer(buffer);
var consumer = new Consumer(buffer);
producer.produceItems();
consumer.consumeItems();
