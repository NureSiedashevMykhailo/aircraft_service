import { AircraftService } from '../aircraft/aircraft.service';
import { TelemetryService } from './telemetry.service';
export declare class TelemetryController {
    private readonly telemetryService;
    private readonly aircraftService;
    private readonly logger;
    constructor(telemetryService: TelemetryService, aircraftService: AircraftService);
    createTelemetry(body: any): Promise<{
        success: boolean;
        message: string;
        count: number;
    } | {
        success: boolean;
        message: string;
        data: {
            aircraft_id: number;
            time: Date;
            parameter_name: string;
            value: number;
        };
    }>;
    private isIotFormat;
    private handleIotFormat;
}
