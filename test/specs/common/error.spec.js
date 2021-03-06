"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { assert, expect } = require("chai");

describe("Errors", () => {

  /**
   * All errors thrown by the SDK should be ShipEngineErrors
   */
  function validateShipEngineError (error, expected) {
    // Validate the structure of the ShipEngineError
    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.be.a("string").with.length.above(0);
    expect(error.code).to.be.a("string").with.length.above(0);
    error.originalCode && expect(error.originalCode).to.be.a("string").with.length.above(0);
    error.transactionID && expect(error.transactionID).to.be.a("string").with.length.above(0);

    // Validate that the error matches the expected values
    expect(error.toJSON()).to.deep.equal({
      ...expected,
      name: error.name,
      stack: error.stack,
    });
  }

  it("should throw a validation error", () => {
    try {
      // eslint-disable-next-line no-new
      new CarrierApp();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Integration Platform carrier app: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw a validation error with details", () => {
    try {
      // eslint-disable-next-line no-new
      new CarrierApp(12345);
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID",
        message:
          "Invalid ShipEngine Integration Platform carrier app: \n" +
          "  value must be of type object",
        details: [
          {
            type: "object.base",
            message: "value must be of type object",
            path: [],
            context: {
              label: "value",
              type: "object",
              value: 12345
            },
          }
        ]
      });
    }
  });

  it("should throw an invalid input error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {}
    }));

    try {
      await app.createShipment();
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        originalCode: "ERR_INVALID",
        message:
          "Invalid input to the createShipment method. \n" +
          "Invalid transaction: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw an invalid input error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {}
    }));

    try {
      await app.createShipment({});
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        originalCode: "ERR_INVALID",
        message:
          "Invalid input to the createShipment method. \n" +
          "Invalid transaction: \n" +
          "  id is required",
        details: [
          {
            type: "any.required",
            message: "id is required",
            path: ["id"],
            context: {
              label: "id",
              key: "id",
            },
          }
        ]
      });
    }
  });

  it("should throw an app error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {}
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_APP_ERROR",
        originalCode: "ERR_INVALID",
        transactionID: error.transactionID,
        message:
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  A value is required",
      });
    }
  });

  it("should throw an app error with details", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {
        return {};
      }
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment());
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_APP_ERROR",
        originalCode: "ERR_INVALID",
        transactionID: error.transactionID,
        message:
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  charges is required \n" +
          "  packages is required",
        details: [
          {
            type: "any.required",
            message: "charges is required",
            path: ["charges"],
            context: {
              label: "charges",
              key: "charges",
            },
          },
          {
            type: "any.required",
            message: "packages is required",
            path: ["packages"],
            context: {
              label: "packages",
              key: "packages",
            },
          }
        ]
      });
    }
  });

  it("should throw a currency mismatch error", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment () {}
    }));

    try {
      await app.createShipment(pojo.transaction(), pojo.newShipment({
        packages: [
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "USD" }}),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "EUR" }}),
          pojo.newPackage({ insuredValue: { value: 1.23, currency: "GBP" }}),
        ]
      }));
      assert.fail("An error should have been thrown");
    }
    catch (error) {
      validateShipEngineError(error, {
        code: "ERR_INVALID_INPUT",
        originalCode: "ERR_CURRENCY_MISMATCH",
        message:
          "Invalid input to the createShipment method. \n" +
          "All packages in a shipment must be insured in the same currency. \n" +
          "Currency mismatch: USD, EUR, GBP. All monetary values must be in the same currency.",
        currencies: ["USD", "EUR", "GBP"],
      });
    }
  });

});
