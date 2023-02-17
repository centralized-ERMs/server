import Joi from "joi";

const payloadValidator = (schema: Joi.ObjectSchema) => (payload: object) =>
  schema.validate(payload, { abortEarly: false });

export default payloadValidator;
