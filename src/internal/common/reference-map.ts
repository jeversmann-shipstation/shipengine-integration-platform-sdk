import { ErrorCode, UUID } from "../../public";
import { error } from "./errors";
import { ShipEngineConstructor } from "./types";
import { _internal } from "./utils";
import { Joi, validate } from "./validation";

interface ClassInstance { id: UUID; }

interface Reference {
  type: ShipEngineConstructor;
  instance: ClassInstance;
}

const classInstanceSchema = Joi.object({ id: Joi.string().uuid() }).unknown(true);
const _private = Symbol("private fields");

/**
 * Maps ShipEngine Integration Platform classes by their UUIDs
 */
export class ReferenceMap {
  private readonly [_private] = {
    map: new Map<UUID, Reference>(),
    isFinishedLoading: false,
  };

  /**
   * Adds the given object to the map
   */
  public add(instance: ClassInstance): void {
    let type = instance.constructor as ShipEngineConstructor;
    validate(instance, type[_internal].label, classInstanceSchema);

    let { map, isFinishedLoading } = this[_private];
    let existing = map.get(instance.id);

    if (existing) {
      // We already have a reference to this instance. Just make sure the types match.
      if (existing.type !== type) {
        // There are two different objects with the same UUID
        throw error(ErrorCode.Validation, `Duplicate UUID: ${instance.id}`);
      }
    }
    else {
      if (isFinishedLoading) {
        // The app has already finished loading, so no new objects can be added.
        throw error(ErrorCode.Validation, `Cannot add new ${type[_internal].label} after the app has loaded`);
      }

      // Add this new reference
      map.set(instance.id, { type, instance });
    }
  }

  /**
   * Returns the class instance implements Iinstance with the specified ID, if any
   */
  public get<T extends ClassInstance>(
    instance: ClassInstance | undefined, type: ShipEngineConstructor<T>): T | undefined {

    // This is for optional references
    if (!instance) return undefined;

    validate(instance, type[_internal].label, classInstanceSchema);

    let { map } = this[_private];
    let reference = map.get(instance.id);

    if (reference && reference.type !== type) {
      throw error(ErrorCode.Validation,
        `${instance.id} is a ${reference.type[_internal].label} ID not a ${type[_internal].label} ID`);
    }

    return reference && reference.instance as T;
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends ClassInstance>(
    instance: ClassInstance, type: ShipEngineConstructor<T>): T;
  public lookup<T extends ClassInstance>(
    instance: ClassInstance | undefined, type: ShipEngineConstructor<T>): T | undefined;
  public lookup<T extends ClassInstance>(
    instance: ClassInstance | undefined, type: ShipEngineConstructor<T>): T | undefined {

    // This is for optional references
    if (!instance) return undefined;

    let value = this.get<T>(instance, type);

    if (!value) {
      throw error(ErrorCode.Validation, `Unable to find ${type[_internal].label} ID: ${instance.id}`);
    }

    return value;
  }

  /**
   * Once the app has loaded, no new references can be added
   */
  public finishedLoading() {
    this[_private].isFinishedLoading = true;
  }
}
