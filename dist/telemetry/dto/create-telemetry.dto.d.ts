export declare class TelemetryRecordDto {
    time: string;
    aircraft_id: number;
    parameter_name: string;
    value: number;
}
export declare class CreateTelemetryDto {
    records?: TelemetryRecordDto[];
}
