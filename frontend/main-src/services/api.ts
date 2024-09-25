import {
  isEmpty,
  get,
  set,
  includes,
  startsWith,
  reduce,
  join,
} from "lodash-es";

export interface IApiResponseError {
  detail: string;
  status: number;
  title: string;
}

class ApiClient {
  private static instance: ApiClient | null = null;
  static baseUrl: string = "";
  static apiVersion: string = "";

  static init(baseUrl: string, apiVersion: string) {
    ApiClient.baseUrl = baseUrl;
    ApiClient.apiVersion = apiVersion;
  }

  static getInstance(): ApiClient {
    if (ApiClient.instance === null) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

 // ---> Add This line in case of handling local auth.

  /*static getAccessToken(): string {
    return store.get(ACCESS_TOKEN_KEY);
  }*/

  /*static setAuthorization(accessToken: string, refreshToken?: string) {
    if (!isEmpty(accessToken)) {
      store.set(ACCESS_TOKEN_KEY, accessToken);
    } else {
      store.remove(ACCESS_TOKEN_KEY);
    }

    if (!isEmpty(refreshToken)) {
      store.set(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      store.remove(REFRESH_TOKEN_KEY);
    }
  }*/

  _request<T = Response>(
    method: string,
    path: string,
    data?: object,
    opts?: object,
    headersOpt?: object,
  ): Promise<T> {


    const headers = new Headers();
    for (const header in headersOpt) {
      headers.append(header, get(headersOpt, header));
    }
    // default to explicit JSON
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    let url: string;
    if (includes(path, "auth")) {
      url = `${ApiClient.baseUrl}/${path.replace(/^\/+/, "")}`;
    } else {
      url = `${ApiClient.baseUrl}/${ApiClient.apiVersion}/${path.replace(
        /^\/+/,
        "",
      )}`;
    }

    const manualRedirect =
      get(opts, "redirectSelf", false) || get(opts, "redirectBlank", false);

   /* if (!isEmpty(ApiClient.getAccessToken()) && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${ApiClient.getAccessToken()}`);
    } */

    const options: RequestInit = {
      method: method.trim().toUpperCase(),
      headers,
      redirect: manualRedirect ? "manual" : "follow",
    };

    if (includes(["GET", "HEAD"], options.method)) {
      if (!includes(url, "?")) {
        const vals = reduce(
          data,
          (acc: string[], val: string, key: string) => {
            acc.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);

            return acc;
          },
          [],
        );

        if (!isEmpty(vals)) {
          url += "?" + join(vals, "&");
        }
      }
    } else if (data instanceof FormData) {
      set(options, "body", data);
    } else if (data instanceof Blob) {
      set(options, "body", data);
    } else {
      headers.set("Content-Type", "application/json");
      set(options, "body", JSON.stringify(data));
    }

    const r = new Request(url, options);
    return fetch(r)
      .then((resp) => {
        if (!resp.ok) {
          if (resp.type === "opaqueredirect") {
            if (get(opts, "redirectSelf", false)) {
              window.location.assign(url);
            } else {
              window.open(url);
            }
          }

          if (
            resp.headers.has("Content-Type") &&
            includes(resp.headers.get("Content-Type"), "application/json")
          ) {
            return new Promise((_resolve, reject) => {
              resp.json().then((r) => {
                const apiResponse: IApiResponseError = {
                  status: resp.status,
                  detail: r.detail,
                  title: r.title,
                };
                reject(apiResponse);
              });
            });
          } else {
            throw new Error("Unknow API error");
          }
        }
        if (resp.headers.has("x-upload-id")) {
          return resp.headers.get("x-upload-id");
        }

        if (resp.status === 204) {
          return null;
        }

        // Code to handle save files.
        /*         if (resp.headers.has("Content-Disposition")) {
          const header = resp.headers.get("Content-Disposition");
          const parts = header!.split(";");
          const filename = trim(parts[1].split("=")[1], '"');
          return resp.blob().then((blob) => {
            saveAs(blob, filename);
            return blob;
          });
        } else  */
        if (
          resp.headers.has("Content-Type") &&
          includes(resp.headers.get("Content-Type"), "application/json")
        ) {
          if (
            !resp.headers.has("link") &&
            !resp.headers.has("x-pagination-total-count")
          ) {
            return resp.json();
          }

          // Code that Start pagination
          /* return this.startPagination(resp); */
        } else if (
          resp.headers.has("Content-Type") &&
          includes(resp.headers.get("Content-Type"), "text/plain")
        ) {
          return resp.text();
        } else if (
          resp.headers.has("Content-Type") &&
          includes(resp.headers.get("Content-Type"), "application/python")
        ) {
          return resp.text();
        } else if (
          resp.headers.has("Content-Type") &&
          includes(resp.headers.get("Content-Type"), "application/ruby")
        ) {
          return resp.text();
        } else if (
          resp.headers.has("Content-Type") &&
          startsWith(resp.headers.get("Content-Type") ?? "", "image/")
        ) {
          return resp.blob();
        } else {
          return resp.body;
        }
      })
      .catch((err) => {
        // handle empty response
        if (
          err instanceof SyntaxError &&
          includes(err.message, "in JSON at position 0")
        ) {
          return {};
        }
        if (
          err instanceof SyntaxError &&
          includes(err.message, "Unexpected end of JSON input")
        ) {
          return {};
        }

        throw err;
      });
  }

  async get<T = Response>(
    path: string,
    params?: object,
    opts?: object,
    headersOpt?: Headers,
  ): Promise<T> {
    return this._request<T>("GET", path, params, opts, headersOpt);
  }

  async head<T = Response>(
    path: string,
    params: object,
    opts?: object,
  ): Promise<T> {
    return this._request<T>("HEAD", path, params, opts);
  }

  async patch<T = Response>(
    path: string,
    data: object,
    opts?: object,
    headersOpt?: Headers,
  ): Promise<T> {
    return this._request<T>("PATCH", path, data, opts, headersOpt);
  }

  async put<T = Response>(
    path: string,
    data: object,
    opts?: object,
  ): Promise<T> {
    return this._request<T>("PUT", path, data, opts);
  }

  async post<T = Response>(
    path: string,
    data: object,
    opts?: object,
  ): Promise<T> {
    return this._request<T>("POST", path, data, opts);
  }

  async delete<T = Response>(
    path: string,
    data?: object,
    opts?: object,
  ): Promise<T> {
    return this._request<T>("DELETE", path, data, opts);
  }
}

export default ApiClient;
