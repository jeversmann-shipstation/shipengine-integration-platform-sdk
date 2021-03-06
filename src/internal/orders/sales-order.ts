import { FulfillmentStatus, PaymentMethod, PaymentStatus, SalesOrder as ISalesOrder, SalesOrderPOJO, SalesOrderStatus } from "../../public";
import { AddressWithContactInfo, calculateTotalCharges, Charge, createNotes, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, Note, _internal } from "../common";
import { Buyer } from "./buyer";
import { SalesOrderIdentifier, SalesOrderIdentifierBase } from "./sales-order-identifier";
import { SalesOrderItem } from "./sales-order-item";
import { SellerIdentifier } from "./sellers/seller-identifier";
import { ShippingPreferences } from "./shipping-preferences";


export class SalesOrder extends SalesOrderIdentifierBase implements ISalesOrder {
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      createdDateTime: DateTimeZone[_internal].schema.required(),
      modifiedDateTime: DateTimeZone[_internal].schema,
      status: Joi.string().enum(SalesOrderStatus).required(),
      fulfillmentStatus: Joi.string().enum(FulfillmentStatus),
      paymentStatus: Joi.string().enum(PaymentStatus),
      paymentMethod: Joi.string().enum(PaymentMethod),
      orderURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      seller: SellerIdentifier[_internal].schema.required(),
      buyer: Buyer[_internal].schema.required(),
      shippingPreferences: ShippingPreferences[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema),
      items: Joi.array().min(1).items(SalesOrderItem[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly createdDateTime: DateTimeZone;
  public readonly modifiedDateTime: DateTimeZone;
  public readonly status: SalesOrderStatus;
  public readonly fulfillmentStatus?: FulfillmentStatus;
  public readonly paymentStatus?: PaymentStatus;
  public readonly paymentMethod?: PaymentMethod;
  public readonly orderURL?: URL;
  public readonly shipTo: AddressWithContactInfo;
  public readonly seller: SellerIdentifier;
  public readonly buyer: Buyer;
  public readonly shippingPreferences: ShippingPreferences;
  public readonly charges: ReadonlyArray<Charge>;
  public readonly totalCharges: MonetaryValue;
  public readonly totalAmount: MonetaryValue;
  public readonly items: ReadonlyArray<SalesOrderItem>;
  public readonly notes: ReadonlyArray<Note>;
  public readonly metadata: object;

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.createdDateTime = new DateTimeZone(pojo.createdDateTime);
    this.modifiedDateTime = pojo.modifiedDateTime ? new DateTimeZone(pojo.modifiedDateTime) : this.createdDateTime;
    this.status = pojo.status;
    this.fulfillmentStatus = pojo.fulfillmentStatus;
    this.paymentStatus = pojo.paymentStatus;
    this.paymentMethod = pojo.paymentMethod;
    this.orderURL = pojo.orderURL ? new URL(pojo.orderURL as string) : undefined;
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.seller = new SellerIdentifier(pojo.seller);
    this.buyer = new Buyer(pojo.buyer);
    this.shippingPreferences = new ShippingPreferences(pojo.shippingPreferences || {});
    this.charges = pojo.charges ? pojo.charges.map((charge) => new Charge(charge)) : [];
    this.totalCharges = calculateTotalCharges(this.charges);
    this.items = pojo.items.map((item) => new SalesOrderItem(item));
    this.totalAmount = MonetaryValue.sum([
      this.totalCharges,
      ...this.items.map((item) => item.totalAmount)
    ]);
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
