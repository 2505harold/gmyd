export class Usuario {
  constructor(
    public _id?: string,
    public correo?: string,
    public password?: string,
    public nombre?: string,
    public apellido?: string,
    public departamento?: string,
    public provincia?: string,
    public distrito?: string,
    public rol?: string,
    public fecha_creacion?: string
  ) {}
}
