import { TelemetryService } from './telemetry.service';
import { TelemetryRecordDto } from './dto/create-telemetry.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    createTelemetry(body: TelemetryRecordDto | TelemetryRecordDto[]): Promise<{
        success: boolean;
        message: string;
        count: number;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            time: Date;
            parameter_name: string;
            value: number;
            aircraft_id: number;
        };
        count?: undefined;
    }>;
}
