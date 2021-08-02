import { AppService } from 'core/services';

class BaseService {
	constructor(public endpoint: string, public appService: AppService) {}

	getAll = (params?: Object, headers?: HeadersInit) => {
		return this.appService.get(this.endpoint, params, headers);
	};

	get = (id: string, params?: Object, headers?: HeadersInit) => {
		return this.appService.get(this.endpoint + `/${id}`, params, headers);
	};

	put = (id: string, data?: any, headers?: HeadersInit) => {
		return this.appService.put(this.endpoint + `/${id || data?.id || ''}`, data, headers);
	};

	post = (data?: Object, headers?: HeadersInit) => {
		return this.appService.post(this.endpoint, data, headers);
	};

	delete = (id:string, data?: any, headers?: HeadersInit) => {
		return this.appService.delete(this.endpoint + `/${id || data?.id || ''}`, data, headers);
	};
}

export default BaseService;
