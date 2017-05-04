
import _ from 'lodash'

export default function checkMandatoryFields(fields, mandatoryFields, name) {

  _.forEach(fields, function (o, key) {
    if (o === '') delete fields[key];
  });

  if (!mandatoryFields || _.isEmpty(mandatoryFields)) {
    return null;
  }

  let differences = _.difference(mandatoryFields, _.keysIn(fields));

  if (!_.isEmpty(differences)) {
    return {statusCode:422, message: "fields missing (" + differences + ")", name};
  }

  return null;

}
