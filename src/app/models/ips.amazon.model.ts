export class IpsAmazon {
  constructor(
    public _id: string,
    public ip_prefix: string,
    public region: string,
    public service: string,
    public network_border_group: string,
    public delay: number
  ) {}
}
