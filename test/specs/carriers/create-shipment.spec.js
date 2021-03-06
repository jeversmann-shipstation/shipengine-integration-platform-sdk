"use strict";

const { CarrierApp } = require("../../../lib/internal");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("createShipment", () => {

  it("should return a shipment from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        packages: [{
          documents: [{
            type: "label",
            size: "letter",
            format: "pdf",
            data: Buffer.from("data"),
          }]
        }]
      })
    }));

    let confirmation = await app.createShipment(pojo.transaction(), pojo.newShipment());

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        description: "",
        code: "",
        notes: [],
        type: "shipping",
        amount: {
          value: "123.46",
          currency: "CAD",
        }
      }],
      totalAmount: {
        value: "123.46",
        currency: "CAD",
      },
      packages: [{
        trackingNumber: "",
        identifiers: {},
        metadata: {},
        documents: [{
          name: "Label",
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
          referenceFields: [],
        }]
      }],
    });
  });

  it("should return a shipment from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        trackingNumber: "123456-ABCDEF",
        identifiers: {
          myShipmentID: "123456-ABCDEF",
        },
        deliveryDateTime: "2005-05-05T05:05:05.0005Z",
        charges: [
          {
            name: "Shipping Charges",
            description: "charges for shipping",
            code: "SHIP",
            type: "shipping",
            amount: {
              value: 8.95,
              currency: "GBP",
            },
            notes: "extra charge because reasons",
          },
          {
            name: "VAT",
            description: "value added tax",
            code: "VAT",
            notes: "Her majesty the queen demands it",
            type: "tax",
            amount: {
              value: 2,
              currency: "GBP",
            }
          },
        ],
        packages: [{
          trackingNumber: "ABCDEF-123456",
          identifiers: {
            myPackageID: "123456-ABCDEF-1",
          },
          documents: [
            {
              name: "Shipping Label",
              type: "label",
              size: "letter",
              format: "pdf",
              data: Buffer.from("label data"),
              referenceFields: ["one", "two", "three"],
            },
            {
              name: "Customs Form",
              type: "customs_form",
              size: "A4",
              format: "png",
              data: Buffer.from("customs form data"),
            },
          ],
          metadata: {
            fizz: "buzz",
          },
        }],
      })
    }));

    let confirmation = await app.createShipment(pojo.transaction(), pojo.newShipment());

    expect(confirmation).to.deep.equal({
      trackingNumber: "123456-ABCDEF",
      identifiers: {
        myShipmentID: "123456-ABCDEF",
      },
      deliveryDateTime: {
        value: "2005-05-05T05:05:05.0005",
        offset: "+00:00",
        timeZone: "UTC",
      },
      charges: [
        {
          name: "Shipping Charges",
          description: "charges for shipping",
          code: "SHIP",
          notes: [
            {
              type: "uncategorized",
              text: "extra charge because reasons",
            }
          ],
          type: "shipping",
          amount: {
            value: "8.95",
            currency: "GBP",
          }
        },
        {
          name: "VAT",
          description: "value added tax",
          code: "VAT",
          notes: [
            {
              type: "uncategorized",
              text: "Her majesty the queen demands it",
            }
          ],
          type: "tax",
          amount: {
            value: "2.00",
            currency: "GBP",
          }
        },
      ],
      totalAmount: {
        value: "10.95",
        currency: "GBP",
      },
      packages: [{
        trackingNumber: "ABCDEF-123456",
        identifiers: {
          myPackageID: "123456-ABCDEF-1",
        },
        documents: [
          {
            name: "Shipping Label",
            type: "label",
            size: "letter",
            format: "pdf",
            data: Buffer.from("label data"),
            referenceFields: ["one", "two", "three"],
          },
          {
            name: "Customs Form",
            type: "customs_form",
            size: "A4",
            format: "png",
            data: Buffer.from("customs form data"),
          },
        ],
        metadata: {
          fizz: "buzz",
        },
      }],
    });
  });


  it("should accept decimals as a package weight value", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      createShipment: () => ({
        charges: [{
          type: "shipping",
          amount: {
            value: 123.456,
            currency: "CAD",
          },
        }],
        packages: [{
          documents: [{
            type: "label",
            size: "letter",
            format: "pdf",
            data: Buffer.from("data"),
          }]
        }]
      })
    }));


    const newShipment = pojo.newShipment();
    newShipment.packages[0].weight = {
      value: 11.3,
      unit: "g"
    };

    let confirmation = await app.createShipment(pojo.transaction(), newShipment);

    expect(confirmation).to.deep.equal({
      trackingNumber: "",
      identifiers: {},
      deliveryDateTime: undefined,
      charges: [{
        name: "",
        description: "",
        code: "",
        notes: [],
        type: "shipping",
        amount: {
          value: "123.46",
          currency: "CAD",
        }
      }],
      totalAmount: {
        value: "123.46",
        currency: "CAD",
      },
      packages: [{
        trackingNumber: "",
        identifiers: {},
        metadata: {},
        documents: [{
          name: "Label",
          type: "label",
          size: "letter",
          format: "pdf",
          data: Buffer.from("data"),
          referenceFields: [],
        }]
      }],
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment () { }
      }));

      try {
        await app.createShipment();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment () { }
      }));

      try {
        await app.createShipment(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called with an invalid shipment", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment () { }
      }));

      try {
        await app.createShipment(pojo.transaction(), {
          shipFrom: "here",
          shipTo: "there",
          shipDateTime: true,
          packages: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  deliveryService is required \n" +
          "  shipFrom must be of type object \n" +
          "  shipTo must be of type object \n" +
          "  shipDateTime must be one of date, string, object \n" +
          "  packages must contain at least 1 items"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment () { }
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid shipment is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => ({
          deliveryDateTime: true,
          packages: []
        })
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  deliveryDateTime must be one of date, string, object \n" +
          "  charges is required \n" +
          "  packages must contain at least 1 items"
        );
      }
    });

    it("should throw an error if the document is invalid", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => pojo.shipmentConfirmation({
          packages: [
            pojo.packageConfirmation({
              documents: [
                {
                  name: "   \n\t  ",
                  type: "letter",
                },
              ]
            }),
          ]
        }),
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the createShipment method. \n" +
          "Invalid shipment: \n" +
          "  packages[0].documents[0] does not match any of the allowed types"
        );
      }
    });

    it("should throw an error if the document is empty", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        createShipment: () => pojo.shipmentConfirmation({
          packages: [
            pojo.packageConfirmation({
              documents: [
                pojo.document({
                  data: Buffer.alloc(0),
                }),
              ]
            }),
          ]
        }),
      }));

      try {
        await app.createShipment(pojo.transaction(), pojo.newShipment());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in the createShipment method. \n" +
          "Label data cannot be empty"
        );
      }
    });

  });
});
