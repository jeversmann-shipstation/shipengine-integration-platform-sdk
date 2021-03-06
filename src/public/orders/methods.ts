import type { Transaction } from "../common";
import type { SalesOrderPOJO } from "./sales-order";
import type { SalesOrderIdentifier } from "./sales-order-identifier";
import type { SalesOrderTimeRange } from "./sales-order-time-range";
import type { SellerPOJO } from "./sellers/seller";
import type { SellerIdentifier } from "./sellers/seller-identifier";
import { SalesOrderShipment } from "./shipments/sales-order-shipment";

/**
 * Returns detailed information about a seller on the marketplace
 */
export type GetSeller = (transaction: Transaction, seller: SellerIdentifier)
  => SellerPOJO | Promise<SellerPOJO>;


/**
 * Returns detailed information about a specific sales order
 */
export type GetSalesOrder = (transaction: Transaction, salesOrder: SalesOrderIdentifier)
  => SalesOrderPOJO | Promise<SalesOrderPOJO>;


/**
 * Returns all orders that were created and/or modified within a given timeframe
 */
export type GetSalesOrdersByDate = (transaction: Transaction, range: SalesOrderTimeRange)
  => Iterable<SalesOrderPOJO> | Promise<Iterable<SalesOrderPOJO>> | AsyncIterable<SalesOrderPOJO>;


/**
 * Called when a shipment is created for one or more items in one or more sales orders.
 *
 * A single shipment may contain items from multiple sales orders, and a single sales order
 * may be fulfilled by multiple shipments.
 */
export type ShipmentCreated = (transaction: Transaction, shipment: SalesOrderShipment)
  => void | Promise<void>;


/**
 * Called when a shipment is cancelled for one or more items in one or more sales orders.
 *
 * A single shipment may contain items from multiple sales orders, and a single sales order
 * may be fulfilled by multiple shipments.
 */
export type ShipmentCancelled = (transaction: Transaction, shipment: SalesOrderShipment)
  => void | Promise<void>;
