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
var utils = __toESM(require("@iobroker/adapter-core"));
var import_dmx = __toESM(require("dmx"));
class Nodedmx2 extends utils.Adapter {
  mydmx;
  existingObjects = {};
  currentStateValues = {};
  // private operatingModes: OperatingModes = {};
  stateChangeListeners = {};
  stateEventHandlers = {};
  cacheEvents = false;
  eventsCache = {};
  constructor(options = {}) {
    super({
      // dirname: __dirname.indexOf('node_modules') !== -1 ? undefined : __dirname + '/../',
      ...options,
      name: "nodedmx"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    this.setState("info.connection", false, true);
    this.log.info(`Adapter state Ready`);
    this.mydmx = new import_dmx.default();
    this.mydmx.universe = this.mydmx.addUniverse("myusb", this.config.driver, this.config.device, "null");
    this.log.info(`Universe erzeugt`);
    this.mydmx.universe.updateAll(0);
    if (this.config.channels_used > 224) {
      this.config.channels_used = 224;
    }
    if (this.config.channels_used < 0) {
      this.config.channels_used = 1;
    }
    this.log.debug("config option1: " + this.config.device);
    this.log.debug("config option3: " + this.config.driver);
    this.log.debug("config option4: " + this.config.channels_used);
    this.setState("info.connection", true, true);
    for (let i = 0; i <= this.config.channels_used; i++) {
      this.setObjectNotExists(this.GetDMX(i), {
        type: "state",
        common: { name: "DMX channel " + i, type: "number", role: "value", read: true, write: true },
        native: {}
      });
    }
    this.subscribeStates("*");
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    var _a, _b, _c;
    try {
      (_b = (_a = this.mydmx) == null ? void 0 : _a.universe) == null ? void 0 : _b.close();
      (_c = this.mydmx) == null ? void 0 : _c.close();
      callback();
    } catch (e) {
      callback();
    }
  }
  /**
   * Is called if a subscribed state changes
   */
  onStateChange(id, state) {
    if (state) {
      this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      const portstring = id.substring(this.name.length);
      const portnumber = parseInt(portstring.substring(3));
      this.log.debug(`number ${portnumber}`);
      this.log.debug(`value ${state.val}`);
      this.mydmx.universe.update({ [portnumber]: state.val });
    } else {
      this.log.debug(`state ${id} deleted`);
    }
  }
  GetDMX(number) {
    if (number < 10) {
      return "00" + number;
    }
    if (number < 100) {
      return "0" + number;
    }
    return "" + number;
  }
}
if (require.main !== module) {
  module.exports = (options) => new Nodedmx2(options);
} else {
  (() => new Nodedmx2())();
}
//# sourceMappingURL=main.js.map
