//

import {
  NextFunction,
  Params,
  ParamsDictionary,
  Request,
  RequestHandler,
  Response
} from "express-serve-static-core";
import "reflect-metadata";
import {
  Controller
} from "./controller";


const KEY = Symbol("controller");

type Metadata = Array<RequestHandlerSpec>;
type MethodType = "get" | "post";
type RequestHandlerSpec = {
  name: string | symbol,
  path: string,
  method: MethodType,
  befores: Array<RequestHandler<any>>,
  afters: Array<RequestHandler<any>>
};

export function controller(path: string): ClassDecorator {
  const decorator = function (clazz: Function): void {
    const originalSetup = clazz.prototype.setup;
    clazz.prototype.setup = function (this: Controller): void {
      const anyThis = this as any;
      const metadata = Reflect.getMetadata(KEY, clazz.prototype) as Metadata;
      for (const spec of metadata) {
        const handler = function (request: Request, response: Response, next: NextFunction): void {
          Promise.resolve(anyThis[spec.name].call(anyThis, request, response, next)).catch((error) => {
            next(error);
          });
        };
        this.router[spec.method](spec.path, ...spec.befores, handler, ...spec.afters);
      }
      this.path = path;
      originalSetup();
    };
  };
  return decorator;
}

export function get(path: string): MethodDecorator {
  const decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, name, "get", path);
  };
  return decorator;
}

export function post(path: string): MethodDecorator {
  const decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    setPath(target, name, "post", path);
  };
  return decorator;
}

export function before(...middlewares: Array<RequestHandler<any>>): MethodDecorator {
  const decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, name, "before", ...middlewares);
  };
  return decorator;
}

export function after(...middlewares: Array<RequestHandler<any>>): MethodDecorator {
  const decorator = function (target: object, name: string | symbol, descriptor: PropertyDescriptor): void {
    pushMiddlewares(target, name, "after", ...middlewares);
  };
  return decorator;
}

function findHandlerSpec(target: object, name: string | symbol): RequestHandlerSpec {
  let metadata = Reflect.getMetadata(KEY, target) as Metadata;
  if (!metadata) {
    metadata = [];
    Reflect.defineMetadata(KEY, metadata, target);
  }
  let spec = metadata.find((spec) => spec.name === name) ;
  if (spec === undefined) {
    spec = {name, path: "/", method: "get", befores: [], afters: []};
    metadata.push(spec);
  }
  return spec;
}

function setPath(target: object, name: string | symbol, method: MethodType, path: string): void {
  const spec = findHandlerSpec(target, name);
  spec.method = method;
  spec.path = path;
}

function pushMiddlewares<P extends Params = ParamsDictionary>(target: object, name: string | symbol, timing: string, ...middlewares: Array<RequestHandler<P>>): void {
  const spec = findHandlerSpec(target, name);
  if (timing === "before") {
    spec.befores.push(...middlewares);
  } else if (timing === "after") {
    spec.afters.push(...middlewares);
  }
}