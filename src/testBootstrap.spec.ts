import "angular";
import "angular-mocks";
import "./ngRestAdapter";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

export * from "./fixtures.spec";
export * from "./ngRestAdapter";
export var expect = chai.expect;