function InvalidEntityError(message) {
   this.message = message;
   var last_part = new Error().stack.match(/[^\s]+$/);
   this.stack = `${this.name} at ${last_part}`;
}

Object.setPrototypeOf(InvalidEntityError, Error);
InvalidEntityError.prototype = Object.create(Error.prototype);
InvalidEntityError.prototype.name = "InvalidEntityError";
InvalidEntityError.prototype.message = "";
InvalidEntityError.prototype.constructor = InvalidEntityError;
