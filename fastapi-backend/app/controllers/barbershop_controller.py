from typing import TypeVar
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import SQLModel, Session, select

from app.db import get_session
from app.models import (
    Barbero,
    BarberoCreate,
    BarberoUpdate,
    Cita,
    CitaCreate,
    CitaUpdate,
    Cliente,
    ClienteCreate,
    ClienteUpdate,
    Especialidad,
    EspecialidadCreate,
    EspecialidadUpdate,
    EstadoCita,
    EstadoCitaCreate,
    EstadoCitaUpdate,
    EstadoLaboral,
    EstadoLaboralCreate,
    EstadoLaboralUpdate,
    Factura,
    FacturaCreate,
    FacturaUpdate,
    MetodoPago,
    MetodoPagoCreate,
    MetodoPagoUpdate,
    Servicio,
    ServicioCreate,
    ServicioUpdate,
)

router = APIRouter(tags=["barbershop"])

ModelType = TypeVar("ModelType", bound=SQLModel)


def commit_with_handling(session: Session) -> None:
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Conflict while saving data.",
        ) from error


def get_record(session: Session, model: type[ModelType], record_id: UUID) -> ModelType:
    record = session.get(model, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found.")
    return record


def create_record(session: Session, model: type[ModelType], payload: SQLModel) -> ModelType:
    record = model(**payload.model_dump())
    session.add(record)
    commit_with_handling(session)
    session.refresh(record)
    return record


def update_record(session: Session, record: ModelType, payload: SQLModel) -> ModelType:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)
    session.add(record)
    commit_with_handling(session)
    session.refresh(record)
    return record


@router.get("/especialidades", response_model=list[Especialidad])
def list_especialidades(session: Session = Depends(get_session)) -> list[Especialidad]:
    return session.exec(select(Especialidad)).all()


@router.post(
    "/especialidades",
    response_model=Especialidad,
    status_code=status.HTTP_201_CREATED,
)
def create_especialidad(
    payload: EspecialidadCreate, session: Session = Depends(get_session)
) -> Especialidad:
    return create_record(session, Especialidad, payload)


@router.get("/especialidades/{especialidad_id}", response_model=Especialidad)
def get_especialidad(
    especialidad_id: UUID, session: Session = Depends(get_session)
) -> Especialidad:
    return get_record(session, Especialidad, especialidad_id)


@router.put("/especialidades/{especialidad_id}", response_model=Especialidad)
def update_especialidad(
    especialidad_id: UUID,
    payload: EspecialidadUpdate,
    session: Session = Depends(get_session),
) -> Especialidad:
    record = get_record(session, Especialidad, especialidad_id)
    return update_record(session, record, payload)


@router.delete("/especialidades/{especialidad_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_especialidad(
    especialidad_id: UUID, session: Session = Depends(get_session)
) -> None:
    record = get_record(session, Especialidad, especialidad_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/estado-laboral", response_model=list[EstadoLaboral])
def list_estado_laboral(session: Session = Depends(get_session)) -> list[EstadoLaboral]:
    return session.exec(select(EstadoLaboral)).all()


@router.post(
    "/estado-laboral",
    response_model=EstadoLaboral,
    status_code=status.HTTP_201_CREATED,
)
def create_estado_laboral(
    payload: EstadoLaboralCreate, session: Session = Depends(get_session)
) -> EstadoLaboral:
    return create_record(session, EstadoLaboral, payload)


@router.get("/estado-laboral/{estado_id}", response_model=EstadoLaboral)
def get_estado_laboral(
    estado_id: UUID, session: Session = Depends(get_session)
) -> EstadoLaboral:
    return get_record(session, EstadoLaboral, estado_id)


@router.put("/estado-laboral/{estado_id}", response_model=EstadoLaboral)
def update_estado_laboral(
    estado_id: UUID, payload: EstadoLaboralUpdate, session: Session = Depends(get_session)
) -> EstadoLaboral:
    record = get_record(session, EstadoLaboral, estado_id)
    return update_record(session, record, payload)


@router.delete("/estado-laboral/{estado_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estado_laboral(estado_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, EstadoLaboral, estado_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/barberos", response_model=list[Barbero])
def list_barberos(session: Session = Depends(get_session)) -> list[Barbero]:
    return session.exec(select(Barbero)).all()


@router.post("/barberos", response_model=Barbero, status_code=status.HTTP_201_CREATED)
def create_barbero(payload: BarberoCreate, session: Session = Depends(get_session)) -> Barbero:
    return create_record(session, Barbero, payload)


@router.get("/barberos/{barbero_id}", response_model=Barbero)
def get_barbero(barbero_id: UUID, session: Session = Depends(get_session)) -> Barbero:
    return get_record(session, Barbero, barbero_id)


@router.put("/barberos/{barbero_id}", response_model=Barbero)
def update_barbero(
    barbero_id: UUID, payload: BarberoUpdate, session: Session = Depends(get_session)
) -> Barbero:
    record = get_record(session, Barbero, barbero_id)
    return update_record(session, record, payload)


@router.delete("/barberos/{barbero_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_barbero(barbero_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, Barbero, barbero_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/clientes", response_model=list[Cliente])
def list_clientes(session: Session = Depends(get_session)) -> list[Cliente]:
    return session.exec(select(Cliente)).all()


@router.post("/clientes", response_model=Cliente, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: ClienteCreate, session: Session = Depends(get_session)) -> Cliente:
    return create_record(session, Cliente, payload)


@router.get("/clientes/{cliente_id}", response_model=Cliente)
def get_cliente(cliente_id: UUID, session: Session = Depends(get_session)) -> Cliente:
    return get_record(session, Cliente, cliente_id)


@router.put("/clientes/{cliente_id}", response_model=Cliente)
def update_cliente(
    cliente_id: UUID, payload: ClienteUpdate, session: Session = Depends(get_session)
) -> Cliente:
    record = get_record(session, Cliente, cliente_id)
    return update_record(session, record, payload)


@router.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cliente(cliente_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, Cliente, cliente_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/servicios", response_model=list[Servicio])
def list_servicios(session: Session = Depends(get_session)) -> list[Servicio]:
    return session.exec(select(Servicio)).all()


@router.post("/servicios", response_model=Servicio, status_code=status.HTTP_201_CREATED)
def create_servicio(
    payload: ServicioCreate, session: Session = Depends(get_session)
) -> Servicio:
    return create_record(session, Servicio, payload)


@router.get("/servicios/{servicio_id}", response_model=Servicio)
def get_servicio(servicio_id: UUID, session: Session = Depends(get_session)) -> Servicio:
    return get_record(session, Servicio, servicio_id)


@router.put("/servicios/{servicio_id}", response_model=Servicio)
def update_servicio(
    servicio_id: UUID, payload: ServicioUpdate, session: Session = Depends(get_session)
) -> Servicio:
    record = get_record(session, Servicio, servicio_id)
    return update_record(session, record, payload)


@router.delete("/servicios/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_servicio(servicio_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, Servicio, servicio_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/estado-cita", response_model=list[EstadoCita])
def list_estado_cita(session: Session = Depends(get_session)) -> list[EstadoCita]:
    return session.exec(select(EstadoCita)).all()


@router.post(
    "/estado-cita",
    response_model=EstadoCita,
    status_code=status.HTTP_201_CREATED,
)
def create_estado_cita(
    payload: EstadoCitaCreate, session: Session = Depends(get_session)
) -> EstadoCita:
    return create_record(session, EstadoCita, payload)


@router.get("/estado-cita/{estado_id}", response_model=EstadoCita)
def get_estado_cita(estado_id: UUID, session: Session = Depends(get_session)) -> EstadoCita:
    return get_record(session, EstadoCita, estado_id)


@router.put("/estado-cita/{estado_id}", response_model=EstadoCita)
def update_estado_cita(
    estado_id: UUID, payload: EstadoCitaUpdate, session: Session = Depends(get_session)
) -> EstadoCita:
    record = get_record(session, EstadoCita, estado_id)
    return update_record(session, record, payload)


@router.delete("/estado-cita/{estado_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estado_cita(estado_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, EstadoCita, estado_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/citas", response_model=list[Cita])
def list_citas(session: Session = Depends(get_session)) -> list[Cita]:
    return session.exec(select(Cita)).all()


@router.post("/citas", response_model=Cita, status_code=status.HTTP_201_CREATED)
def create_cita(payload: CitaCreate, session: Session = Depends(get_session)) -> Cita:
    return create_record(session, Cita, payload)


@router.get("/citas/{cita_id}", response_model=Cita)
def get_cita(cita_id: UUID, session: Session = Depends(get_session)) -> Cita:
    return get_record(session, Cita, cita_id)


@router.put("/citas/{cita_id}", response_model=Cita)
def update_cita(
    cita_id: UUID, payload: CitaUpdate, session: Session = Depends(get_session)
) -> Cita:
    record = get_record(session, Cita, cita_id)
    return update_record(session, record, payload)


@router.delete("/citas/{cita_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cita(cita_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, Cita, cita_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/metodo-pago", response_model=list[MetodoPago])
def list_metodo_pago(session: Session = Depends(get_session)) -> list[MetodoPago]:
    return session.exec(select(MetodoPago)).all()


@router.post("/metodo-pago", response_model=MetodoPago, status_code=status.HTTP_201_CREATED)
def create_metodo_pago(
    payload: MetodoPagoCreate, session: Session = Depends(get_session)
) -> MetodoPago:
    return create_record(session, MetodoPago, payload)


@router.get("/metodo-pago/{metodo_id}", response_model=MetodoPago)
def get_metodo_pago(
    metodo_id: UUID, session: Session = Depends(get_session)
) -> MetodoPago:
    return get_record(session, MetodoPago, metodo_id)


@router.put("/metodo-pago/{metodo_id}", response_model=MetodoPago)
def update_metodo_pago(
    metodo_id: UUID, payload: MetodoPagoUpdate, session: Session = Depends(get_session)
) -> MetodoPago:
    record = get_record(session, MetodoPago, metodo_id)
    return update_record(session, record, payload)


@router.delete("/metodo-pago/{metodo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_metodo_pago(metodo_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, MetodoPago, metodo_id)
    session.delete(record)
    commit_with_handling(session)


@router.get("/facturas", response_model=list[Factura])
def list_facturas(session: Session = Depends(get_session)) -> list[Factura]:
    return session.exec(select(Factura)).all()


@router.post("/facturas", response_model=Factura, status_code=status.HTTP_201_CREATED)
def create_factura(payload: FacturaCreate, session: Session = Depends(get_session)) -> Factura:
    return create_record(session, Factura, payload)


@router.get("/facturas/{factura_id}", response_model=Factura)
def get_factura(factura_id: UUID, session: Session = Depends(get_session)) -> Factura:
    return get_record(session, Factura, factura_id)


@router.put("/facturas/{factura_id}", response_model=Factura)
def update_factura(
    factura_id: UUID, payload: FacturaUpdate, session: Session = Depends(get_session)
) -> Factura:
    record = get_record(session, Factura, factura_id)
    return update_record(session, record, payload)


@router.delete("/facturas/{factura_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factura(factura_id: UUID, session: Session = Depends(get_session)) -> None:
    record = get_record(session, Factura, factura_id)
    session.delete(record)
    commit_with_handling(session)
