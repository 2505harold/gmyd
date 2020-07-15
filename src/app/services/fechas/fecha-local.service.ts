import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable()
export class FechaLocalService {
  actual: string;
  constructor(private datePipe: DatePipe) {
    this.actual = this.local(new Date());
  }

  //====================================================
  // Formato Largo de Fecha
  //====================================================
  largaSig(fecha?: any) {
    if (fecha) {
      const _fecha = new Date(fecha);
      const _next = _fecha.setDate(_fecha.getDate() + 1);
      return this.local(new Date(_next));
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() + 1);
      return this.local(new Date(_next));
    }
  }

  largaAnt(fecha?: any) {
    if (fecha) {
      let _fecha = new Date(fecha);
      let _next = _fecha.setDate(_fecha.getDate() - 1);
      return this.local(new Date(_next));
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() - 1);
      return this.local(new Date(_next));
    }
  }

  larga(numero: number, fecha?: any) {
    if (fecha) {
      let _fecha = new Date(fecha);
      let _next = _fecha.setDate(_fecha.getDate() + numero);
      return this.local(new Date(_next));
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() + numero);
      return this.local(new Date(_next));
    }
  }

  //====================================================
  // Formato corto de Fecha
  //====================================================
  cortaSig(fecha?: any) {
    if (fecha) {
      const _fecha = new Date(fecha);
      const _next = _fecha.setDate(_fecha.getDate() + 1);
      return this.datePipe.transform(_next, "yyyy-M-dd");
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() + 1);
      return this.datePipe.transform(_next, "yyyy-M-dd");
    }
  }

  cortaAnt(fecha?: any) {
    if (fecha) {
      let _fecha = new Date(fecha);
      let _next = _fecha.setDate(_fecha.getDate() - 1);
      return this.local(new Date(_next));
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() - 1);
      return this.local(new Date(_next));
    }
  }

  corta(numero: number, fecha?: any) {
    if (fecha) {
      let _fecha = new Date(fecha);
      let _next = _fecha.setDate(_fecha.getDate() + numero);
      return this.datePipe.transform(_next, "yyyy-M-dd");
    } else {
      const _fecha = new Date();
      const _next = _fecha.setDate(_fecha.getDate() + numero);
      return this.datePipe.transform(_next, "yyyy-M-dd");
    }
  }

  local(fecha) {
    return new Date(fecha).toLocaleString("es-PE", {
      timeZone: "America/Lima",
    });
  }
}
