/**
 * Represents a successful result from a model.
 */
export interface StatusSuccess<T> {
  status: "success";
  data: {
    [key: string]: T;
  };
}

/**
 * Represents a failed result due to client error from a model.
 */
export interface StatusFail {
  status: "fail";
  messages: Array<string>;
}

/**
 * Represents an error from a model due to server error.
 */
export interface StatusError {
  status: "error";
  message: string;
}

/**
 * Represents a successful deletion request.
 */
export interface StatusDelete {
  status: "success";
  data: null;
}
