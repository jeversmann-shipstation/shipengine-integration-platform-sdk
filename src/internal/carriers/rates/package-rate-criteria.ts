import { PackageRateCriteria as IPackageRateCriteria, PackageRateCriteriaPOJO } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { Packaging } from "../packaging";

export class PackageRateCriteria implements IPackageRateCriteria {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.array().items(DefinitionIdentifier[_internal].schema.unknown(true)),
      deliveryConfirmations: Joi.array().items(DefinitionIdentifier[_internal].schema.unknown(true)),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
    }),
  };

  public readonly packaging: ReadonlyArray<Packaging>;
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;
  public readonly insuredValue?: MonetaryValue;
  public readonly containsAlcohol: boolean;
  public readonly isNonMachinable: boolean;

  public constructor(pojo: PackageRateCriteriaPOJO, app: App) {
    this.packaging = (pojo.packaging || [])
      .map((id) => app[_internal].references.lookup(id, Packaging));
    this.deliveryConfirmations = (pojo.deliveryConfirmations || [])
      .map((id) => app[_internal].references.lookup(id, DeliveryConfirmation));
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
