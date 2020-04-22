export class NperfMeter {
  constructor(
    public downlink_max: string,
    public downlink_avg: string,
    public uplink_max: string,
    public uplink_avg: string,
    public latency_min: string,
    public latency_avg: string,
    public latency_jitter: string,
    public navegacion: string,
    public streaming: string,
    public claro: string,
    public bitel: string,
    public movistar: string,
    public entel: string,
    public pruebas: string,
    public fecha_ingreso?: string
  ) {}
}
