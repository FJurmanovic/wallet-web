class HttpClient {
	private url: string;
	constructor() {
		this.url = `${__CONFIG__.ssl ? 'https' : 'http'}://${__CONFIG__.apiUrl}/${__CONFIG__.apiVersion}`;
	}

	post(url: string, data: Object, headersParam: HeadersInit): Promise<any> {
		let headers: Headers = new Headers(headersParam);
		let body: BodyType = null;
		if (data instanceof FormData) {
			body = data;
		} else {
			body = JSON.stringify(data);
			headers.append('Content-Type', 'application/json');
		}
		let options: OptionsType = {
			method: 'POST',
			headers: headers,
			body: body,
		};
		const req: Request = new Request(resolveUrl(this.url, url), options);

		return createRequest(req);
	}

	put(url: string, data: Object, headersParam: HeadersInit): Promise<any> {
		let headers: Headers = new Headers(headersParam);
		headers.append('Content-Type', 'application/json');
		let options: OptionsType = {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify(data),
		};
		const req: Request = new Request(resolveUrl(this.url, url), options);

		return createRequest(req);
	}

	delete(url: string, data: Object, headersParam: HeadersInit): Promise<any> {
		let headers: Headers = new Headers(headersParam);
		headers.append('Content-Type', 'application/json');
		let options: OptionsType = {
			method: 'DELETE',
			headers: headers,
			body: JSON.stringify(data),
		};
		const req: Request = new Request(resolveUrl(this.url, url), options);

		return createRequest(req);
	}

	get(url: string, params: Object, headersParam: HeadersInit): Promise<any> {
		let headers: Headers = new Headers(headersParam);
		let options: OptionsType = {
			method: 'GET',
			headers: headers,
		};
		let paramsPath: string = '';
		if (params) {
			let urlParams = new URLSearchParams(Object.entries(params));
			paramsPath = '?' + urlParams;
		}
		const req: Request = new Request(resolveUrl(this.url, url + paramsPath), options);

		return createRequest(req);
	}
}

export default HttpClient;

async function createRequest(request: Request): Promise<Response> {
	let response: Response = await fetch(request);
	if (
		!response.ok &&
		response.status !== 403 &&
		response.status !== 400 &&
		response.status !== 401 &&
		response.status !== 500
	) {
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		if (response.headers.get('Content-Type') !== null) {
			let newResponse: Response = await createResponse(response);
			return newResponse;
		}
		return response;
	}
}

async function createResponse(response: Response): Promise<any> {
	const type: string = response.headers.get('Content-Type');
	const body = (): Promise<any> => {
		if (type.indexOf('application/json') !== -1) {
			return response.json();
		}
		return response.text();
	};

	return body();
}

function resolveUrl(url: string, path: string): string {
	if (path.includes('http') || path.includes('://')) {
		return path;
	}
	const fixedPath = path
		.split('/')
		.filter((i) => i)
		.join('/');
	const urlWithPath = `${url.endsWith('/') ? url : `${url}/`}${fixedPath}`;
	return urlWithPath;
}

type BodyType = string | FormData;
type OptionsType = {
	method: string;
	headers?: Headers;
	body?: BodyType;
};
