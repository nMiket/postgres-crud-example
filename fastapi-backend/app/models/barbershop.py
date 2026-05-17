from datetime import date, datetime, time
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, Numeric, UniqueConstraint
from sqlmodel import Field, SQLModel


class EspecialidadBase(SQLModel):
    descripcion: str


class Especialidad(EspecialidadBase, table=True):
    __tablename__ = "especialidades"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class EspecialidadCreate(EspecialidadBase):
    pass


class EspecialidadUpdate(SQLModel):
    descripcion: Optional[str] = None


class EstadoLaboralBase(SQLModel):
    descripcion: str


class EstadoLaboral(EstadoLaboralBase, table=True):
    __tablename__ = "estado_laboral"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class EstadoLaboralCreate(EstadoLaboralBase):
    pass


class EstadoLaboralUpdate(SQLModel):
    descripcion: Optional[str] = None


class BarberoBase(SQLModel):
    nombre_completo: str
    telefono: Optional[str] = None
    especialidad_id: UUID = Field(foreign_key="especialidades.id")
    estado_laboral_id: UUID = Field(foreign_key="estado_laboral.id")


class Barbero(BarberoBase, table=True):
    __tablename__ = "barberos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class BarberoCreate(BarberoBase):
    pass


class BarberoUpdate(SQLModel):
    nombre_completo: Optional[str] = None
    telefono: Optional[str] = None
    especialidad_id: Optional[UUID] = None
    estado_laboral_id: Optional[UUID] = None


class ClienteBase(SQLModel):
    nombre_completo: str
    telefono: Optional[str] = None
    correo_electronico: Optional[str] = None
    fecha_registro: Optional[date] = None


class Cliente(ClienteBase, table=True):
    __tablename__ = "clientes"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    fecha_registro: date = Field(default_factory=date.today)


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(SQLModel):
    nombre_completo: Optional[str] = None
    telefono: Optional[str] = None
    correo_electronico: Optional[str] = None
    fecha_registro: Optional[date] = None


class ServicioBase(SQLModel):
    nombre: str
    precio: Decimal = Field(sa_column=Column(Numeric(10, 2)))
    duracion_minutos: int


class Servicio(ServicioBase, table=True):
    __tablename__ = "servicios"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class ServicioCreate(ServicioBase):
    pass


class ServicioUpdate(SQLModel):
    nombre: Optional[str] = None
    precio: Optional[Decimal] = None
    duracion_minutos: Optional[int] = None


class EstadoCitaBase(SQLModel):
    descripcion: str


class EstadoCita(EstadoCitaBase, table=True):
    __tablename__ = "estado_cita"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class EstadoCitaCreate(EstadoCitaBase):
    pass


class EstadoCitaUpdate(SQLModel):
    descripcion: Optional[str] = None


class CitaBase(SQLModel):
    fecha_cita: date
    hora_cita: time
    cliente_id: UUID = Field(foreign_key="clientes.id")
    barbero_id: UUID = Field(foreign_key="barberos.id")
    servicio_id: UUID = Field(foreign_key="servicios.id")
    estado_cita_id: UUID = Field(foreign_key="estado_cita.id")


class Cita(CitaBase, table=True):
    __tablename__ = "citas"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class CitaCreate(CitaBase):
    pass


class CitaUpdate(SQLModel):
    fecha_cita: Optional[date] = None
    hora_cita: Optional[time] = None
    cliente_id: Optional[UUID] = None
    barbero_id: Optional[UUID] = None
    servicio_id: Optional[UUID] = None
    estado_cita_id: Optional[UUID] = None


class MetodoPagoBase(SQLModel):
    descripcion: str


class MetodoPago(MetodoPagoBase, table=True):
    __tablename__ = "metodo_pago"

    id: UUID = Field(default_factory=uuid4, primary_key=True)


class MetodoPagoCreate(MetodoPagoBase):
    pass


class MetodoPagoUpdate(SQLModel):
    descripcion: Optional[str] = None


class FacturaBase(SQLModel):
    fecha_emision: Optional[datetime] = None
    metodo_pago_id: UUID = Field(foreign_key="metodo_pago.id")
    total_pagado: Decimal = Field(sa_column=Column(Numeric(10, 2)))
    cita_id: UUID = Field(foreign_key="citas.id")


class Factura(FacturaBase, table=True):
    __tablename__ = "facturas"
    __table_args__ = (UniqueConstraint("cita_id", name="facturas_cita_key"),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    fecha_emision: datetime = Field(default_factory=datetime.utcnow)


class FacturaCreate(FacturaBase):
    pass


class FacturaUpdate(SQLModel):
    fecha_emision: Optional[datetime] = None
    metodo_pago_id: Optional[UUID] = None
    total_pagado: Optional[Decimal] = None
    cita_id: Optional[UUID] = None
