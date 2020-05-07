module.exports = {
  ServiceError: {
    httpCode: 500,
    customCode: "error",
  },
  ServiceSuccess: {
    httpCode: 200,
    customCode: "success",
  },
  ServiceInfo: {
    httpCode: 200,
    customCode: "service_info",
  },
  DbError: {
    httpCode: 500,
    customCode: "db_error",
  },
  ValidationError: {
    httpCode: 200,
    customCode: "form_error",
  },
  NotFoundError: {
    httpCode: 404,
    customCode: "not_found_error",
  },
  KernelError: {
    httpCode: 500,
    customCode: "kernel_error",
  },
};
