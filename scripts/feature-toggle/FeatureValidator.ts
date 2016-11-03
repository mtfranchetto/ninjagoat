import IFeatureValidator from "./IFeatureValidator";
import IValidationPredicate from "./IValidationPredicate";

class FeatureValidator implements IFeatureValidator {

    validate(feature:any):boolean {
        let predicate:IValidationPredicate = Reflect.getMetadata("__featuretoggle_predicate", feature);
        if (!predicate)
            throw new Error("Missing predicate on feature");
        return predicate();
    }

}

export default FeatureValidator