import { APIRequestContext } from '@playwright/test';
import { ApiBase } from '../base/APIBase';

export class StarlinkApi extends ApiBase {
    constructor(request: APIRequestContext) {
        super(request);
    }

    public async getAllStarlinkSatellites(): Promise<void> {
        this.response = await this.request.get(`/starlink`, { 
            headers: this.getDefaultHeaders()
        });
    }

    public async getStarlinkSatelliteById(satelliteId: string): Promise<void> {
        this.response = await this.request.get(`/starlink/${satelliteId}`, {
            headers: this.getDefaultHeaders()
        });
    }

    public async queryStarlinkSatellites(jsonBody: string | object): Promise<void> {
        const body = typeof jsonBody === 'string' ? jsonBody : JSON.stringify(jsonBody);
        
        this.response = await this.request.post(`/starlink/query`, {
            headers: this.getDefaultHeaders(),
            data: body
        });
    }

    public async queryWithPagination(jsonBody: string | object): Promise<void> {
        await this.queryStarlinkSatellites(jsonBody);
    }
}