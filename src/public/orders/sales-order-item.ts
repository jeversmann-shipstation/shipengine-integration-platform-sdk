import type { Charge, ChargePOJO, MonetaryValue, MonetaryValuePOJO, Note, NotePOJO, Quantity, QuantityPOJO, URLString, Weight, WeightPOJO } from "../common";
import type { ProductIdentifier, ProductIdentifierPOJO } from "../products";
import type { FulfillmentStatus } from "./enums";
import type { SalesOrderItemIdentifier, SalesOrderItemIdentifierPOJO } from "./sales-order-item-identifier";
import type { ShippingPreferences, ShippingPreferencesPOJO } from "./shipping-preferences";

/**
 * An item in a sales order
 */
export interface SalesOrderItemPOJO extends SalesOrderItemIdentifierPOJO {
  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  description?: string;

  /**
   * Indicates whether the order item has been fulfilled
   */
  fulfillmentStatus?: FulfillmentStatus;

  /**
   * The product associated with this item
   */
  product?: ProductIdentifierPOJO;

  /**
   * The quantity of this item in the sales order
   */
  quantity: QuantityPOJO;

  /**
   * The sale price of each item. This should NOT include additional charges or adjustments,
   * such as taxes or discounts. Use `charges` for those.
   */
  unitPrice: MonetaryValuePOJO;

  /**
   * The weight of each item
   */
  unitWeight?: WeightPOJO;

  /**
   * The URL of a webpage where the customer can view the order item
   */
  itemURL?: URLString | URL;

  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

  /**
   * Preferences on how this item should be shipped
   */
  shippingPreferences?: ShippingPreferencesPOJO;

  /**
   * The breakdown of charges for this order item
   */
  charges?: ReadonlyArray<ChargePOJO>;

  /**
   * Human-readable information regarding this order item, such as gift notes, backorder notices, etc.
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * Arbitrary data about this order item that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * An item in a sales order
 */
export interface SalesOrderItem extends SalesOrderItemIdentifier {
  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  readonly name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  readonly description: string;

  /**
   * Indicates whether the order item has been fulfilled
   */
  readonly fulfillmentStatus?: FulfillmentStatus;

  /**
   * The product associated with this item
   */
  readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the sales order
   */
  readonly quantity: Quantity;

  /**
   * The sale price of each item. This should NOT include additional charges or adjustments,
   * such as taxes or discounts. Use `charges` for those.
   */
  readonly unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  readonly totalPrice: MonetaryValue;

  /**
   * The weight of each item
   */
  readonly unitWeight?: Weight;

  /**
   * The URL of a webpage where the customer can view the order item
   */
  readonly itemURL?: URL;

  /**
   * The URL of a webpage where the customer can track the package
   */
  readonly trackingURL?: URL;

  /**
   * Preferences on how this item should be shipped
   */
  readonly shippingPreferences: ShippingPreferences;

  /**
   * The breakdown of charges for this order item
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this order item
   */
  readonly totalCharges: MonetaryValue;

  /**
   * The total amount of the order item. This is `totalPrice` plus `totalCharges`.
   */
  readonly totalAmount: MonetaryValue;

  /**
   * Human-readable information regarding this order item, such as gift notes, backorder notices, etc.
   */
  readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this order item that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}
