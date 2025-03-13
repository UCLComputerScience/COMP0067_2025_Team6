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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// import * as fs from "fs";
var prisma = new client_1.PrismaClient();
// const jsonData = JSON.parse(fs.readFileSync("dummy_data.json", "utf-8"));
var dummy_data_json_1 = require("./dummy_data.json");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var channel, feeds, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 6]);
                    return [4 /*yield*/, prisma.channel.upsert({
                            where: { id: dummy_data_json_1.default.channel.id },
                            update: {},
                            create: {
                                id: dummy_data_json_1.default.channel.id,
                                name: dummy_data_json_1.default.channel.name,
                                latitude: parseFloat(dummy_data_json_1.default.channel.latitude),
                                longitude: parseFloat(dummy_data_json_1.default.channel.longitude),
                                field1: dummy_data_json_1.default.channel.field1,
                                field2: dummy_data_json_1.default.channel.field2,
                                field3: dummy_data_json_1.default.channel.field3,
                                lastEntryId: dummy_data_json_1.default.channel.last_entry_id,
                            },
                        })];
                case 1:
                    channel = _a.sent();
                    console.log("Inserted Channel: ".concat(channel.name));
                    feeds = dummy_data_json_1.default.feeds.map(function (feed) { return ({
                        entryId: feed.entry_id,
                        createdAt: new Date(feed.created_at),
                        field1: feed.field1 ? parseFloat(feed.field1) : null,
                        field2: feed.field2 ? parseFloat(feed.field2) : null,
                        field3: feed.field3 ? parseFloat(feed.field3) : null,
                    }); });
                    return [4 /*yield*/, prisma.feed.createMany({ data: feeds })];
                case 2:
                    _a.sent();
                    console.log("Inserted ".concat(feeds.length, " feed records."));
                    return [3 /*break*/, 6];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error seeding data:", error_1);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prisma.$disconnect()];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
seedDatabase();
