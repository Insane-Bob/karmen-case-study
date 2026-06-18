import { Injectable } from "@nestjs/common";
import { FINANCING_APPLICATIONS_DATA } from "./data/financing-applications.data";

@Injectable()
export class FinancingApplicationsService {
    private readonly data = FINANCING_APPLICATIONS_DATA;

    findAll() {
        return this.data;
    }

    findOne(id: string) {
        return this.data.find(
            app => app.financing_request.id === id,
        );
    }
}