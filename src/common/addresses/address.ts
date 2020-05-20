// tslint:disable: max-classes-per-file
import { Country } from "../country";
import { hideAndFreeze, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";
import { GeoCoordinatePOJO } from "./geo-coordinate";
import { PartialAddress, PartialAddressBase } from "./partial-address";

/**
 * A mailing address
 */
export interface AddressPOJO {
  company?: string;
  addressLines: string[];
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  timeZone: string;
  isResidential?: boolean;
  coordinates?: GeoCoordinatePOJO;
}


/**
 * Aabstract base class for Address, AddressWithContactInfo, and Buyer
 */
export abstract class AddressBase extends PartialAddressBase {
  //#region Public Fields

  public readonly country!: Country;
  public readonly timeZone!: string;

  //#endregion

  /**
   * Returns the formatted address
   */
  public toString(): string {
    let address = [];
    this.company && address.push(this.company);
    address.push(...this.addressLines);
    address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
    address.push(this.country);
    return address.join("\n");
  }
}


/**
 * A mailing address
 */
export class Address extends AddressBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "address",
    schema: PartialAddress[_internal].schema.keys({
      addressLines: Joi.array().min(1).items(Joi.string().trim().singleLine().min(1).max(100)).required(),
      cityLocality: Joi.string().trim().singleLine().min(1).max(100).required(),
      stateProvince: Joi.string().trim().singleLine().min(1).max(100).required(),
      postalCode: Joi.string().trim().singleLine().min(1).max(100).required(),
      country: Joi.string().enum(Country).required(),
      timeZone: Joi.string().timeZone().required(),
    }),
  };

  //#endregion

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Address);
