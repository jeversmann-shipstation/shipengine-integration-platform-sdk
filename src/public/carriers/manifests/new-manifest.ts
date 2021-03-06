import type { Address, AddressPOJO, DateTimeZone, DateTimeZonePOJO } from "../../common";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * The information needed to create an end-of-day manifest
 */
export interface NewManifestPOJO {
  /**
   * The address of the location that is performaing end-of-day manifesting.
   *
   * NOTE: This field is required if the carrier's `manifestLocations` setting is `single_location`.
   */
  shipFrom?: AddressPOJO;

  /**
   * The start-of-day time, or the `shipmentDateTime` of the earliest shipment being manifested.
   */
  openDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The end-of-day time, or the `shipmentDateTime` of the latest shipment being manifested.
   */
  closeDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The meaning of this field varies depending on the carrier's `manifestShipments` setting.
   *
   * `all_shipments`: This field must include all shipments that have not yet been manifested.
   *
   * `explicit_shipments`: This field specifies which shipments should be manifested.
   *
   * `exclude_shipments`: This field specifies which shipments should _not_ be manifested.
   * All other shipments will be manifested.
   */
  shipments: ReadonlyArray<ShipmentIdentifierPOJO>;
}


/**
 * The information needed to create an end-of-day manifest
 */
export interface NewManifest {
  /**
   * The address of the location that is performaing end-of-day manifesting.
   *
   * NOTE: This field is required if the carrier's `manifestLocations` setting is `single_location`.
   */
  readonly shipFrom?: Address;

  /**
   * The start-of-day time, or the `shipmentDateTime` of the earliest shipment being manifested.
   */
  readonly openDateTime: DateTimeZone;

  /**
   * The end-of-day time, or the `shipmentDateTime` of the latest shipment being manifested.
   */
  readonly closeDateTime: DateTimeZone;

  /**
   * The meaning of this field varies depending on the carrier's `manifestShipments` setting.
   *
   * `all_shipments`: This field must include all shipments that have not yet been manifested.
   *
   * `explicit_shipments`: This field specifies which shipments should be manifested.
   *
   * `exclude_shipments`: This field specifies which shipments should _not_ be manifested.
   * All other shipments will be manifested.
   */
  readonly shipments: ReadonlyArray<ShipmentIdentifier>;
}
