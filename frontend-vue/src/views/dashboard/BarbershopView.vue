<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { PageHeader, RetroPanel } from '@/components/dashboard'
import { useCrudResource } from '@/composables/useCrudResource'

interface CatalogItem {
  id: string
  descripcion: string
}

interface Barbero {
  id: string
  nombre_completo: string
  telefono: string | null
  especialidad_id: string
  estado_laboral_id: string
}

interface Cliente {
  id: string
  nombre_completo: string
  telefono: string | null
  correo_electronico: string | null
  fecha_registro: string
}

interface Servicio {
  id: string
  nombre: string
  precio: number
  duracion_minutos: number
}

interface Cita {
  id: string
  fecha_cita: string
  hora_cita: string
  cliente_id: string
  barbero_id: string
  servicio_id: string
  estado_cita_id: string
}

interface Factura {
  id: string
  fecha_emision: string
  metodo_pago_id: string
  total_pagado: number
  cita_id: string
}

const especialidades = reactive(
  useCrudResource<CatalogItem, { descripcion: string }, { descripcion?: string }>('/especialidades'),
)
const estadosLaborales = reactive(
  useCrudResource<CatalogItem, { descripcion: string }, { descripcion?: string }>('/estado-laboral'),
)
const estadosCita = reactive(
  useCrudResource<CatalogItem, { descripcion: string }, { descripcion?: string }>('/estado-cita'),
)
const metodosPago = reactive(
  useCrudResource<CatalogItem, { descripcion: string }, { descripcion?: string }>('/metodo-pago'),
)
const barberos = reactive(
  useCrudResource<
    Barbero,
    {
      nombre_completo: string
      telefono: string | null
      especialidad_id: string
      estado_laboral_id: string
    },
    Partial<Barbero>
  >('/barberos'),
)
const clientes = reactive(
  useCrudResource<
    Cliente,
    {
      nombre_completo: string
      telefono: string | null
      correo_electronico: string | null
      fecha_registro: string | null
    },
    Partial<Cliente>
  >('/clientes'),
)
const servicios = reactive(
  useCrudResource<
    Servicio,
    { nombre: string; precio: number; duracion_minutos: number },
    Partial<Servicio>
  >('/servicios'),
)
const citas = reactive(
  useCrudResource<
    Cita,
    {
      fecha_cita: string
      hora_cita: string
      cliente_id: string
      barbero_id: string
      servicio_id: string
      estado_cita_id: string
    },
    Partial<Cita>
  >('/citas'),
)
const facturas = reactive(
  useCrudResource<
    Factura,
    { metodo_pago_id: string; total_pagado: number; cita_id: string },
    Partial<Factura>
  >('/facturas'),
)

const especialidadDescripcion = ref('')
const estadoLaboralDescripcion = ref('')
const estadoCitaDescripcion = ref('')
const metodoPagoDescripcion = ref('')
const barberoNombre = ref('')
const barberoTelefono = ref('')
const barberoEspecialidadId = ref('')
const barberoEstadoId = ref('')
const clienteNombre = ref('')
const clienteTelefono = ref('')
const clienteCorreo = ref('')
const clienteFechaRegistro = ref(new Date().toISOString().slice(0, 10))
const servicioNombre = ref('')
const servicioPrecio = ref('')
const servicioDuracion = ref('30')
const citaFecha = ref(new Date().toISOString().slice(0, 10))
const citaHora = ref('09:00')
const citaClienteId = ref('')
const citaBarberoId = ref('')
const citaServicioId = ref('')
const citaEstadoId = ref('')
const facturaMetodoPagoId = ref('')
const facturaTotal = ref('')
const facturaCitaId = ref('')

const especialidadById = computed(
  () => new Map(especialidades.items.map((item) => [item.id, item.descripcion])),
)
const estadoLaboralById = computed(
  () => new Map(estadosLaborales.items.map((item) => [item.id, item.descripcion])),
)
const estadoCitaById = computed(
  () => new Map(estadosCita.items.map((item) => [item.id, item.descripcion])),
)
const metodoPagoById = computed(
  () => new Map(metodosPago.items.map((item) => [item.id, item.descripcion])),
)
const servicioById = computed(
  () => new Map(servicios.items.map((item) => [item.id, item.nombre])),
)
const clienteById = computed(
  () => new Map(clientes.items.map((item) => [item.id, item.nombre_completo])),
)
const barberoById = computed(
  () => new Map(barberos.items.map((item) => [item.id, item.nombre_completo])),
)

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

watch(
  () => especialidades.items,
  (items) => {
    const first = items[0]
    if (!barberoEspecialidadId.value && first) {
      barberoEspecialidadId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => estadosLaborales.items,
  (items) => {
    const first = items[0]
    if (!barberoEstadoId.value && first) {
      barberoEstadoId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => clientes.items,
  (items) => {
    const first = items[0]
    if (!citaClienteId.value && first) {
      citaClienteId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => barberos.items,
  (items) => {
    const first = items[0]
    if (!citaBarberoId.value && first) {
      citaBarberoId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => servicios.items,
  (items) => {
    const first = items[0]
    if (!citaServicioId.value && first) {
      citaServicioId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => estadosCita.items,
  (items) => {
    const first = items[0]
    if (!citaEstadoId.value && first) {
      citaEstadoId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => metodosPago.items,
  (items) => {
    const first = items[0]
    if (!facturaMetodoPagoId.value && first) {
      facturaMetodoPagoId.value = first.id
    }
  },
  { immediate: true },
)

watch(
  () => citas.items,
  (items) => {
    const first = items[0]
    if (!facturaCitaId.value && first) {
      facturaCitaId.value = first.id
    }
  },
  { immediate: true },
)

function optionalText(value: string) {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function lookup(map: Map<string, string>, id: string) {
  return map.get(id) ?? 'Sin asignar'
}

async function safeAction(action: Promise<unknown>) {
  try {
    await action
  } catch {
    // handled by composable error state
  }
}

async function addEspecialidad() {
  const descripcion = especialidadDescripcion.value.trim()
  if (!descripcion) return
  await safeAction(especialidades.createItem({ descripcion }))
  especialidadDescripcion.value = ''
}

async function addEstadoLaboral() {
  const descripcion = estadoLaboralDescripcion.value.trim()
  if (!descripcion) return
  await safeAction(estadosLaborales.createItem({ descripcion }))
  estadoLaboralDescripcion.value = ''
}

async function addEstadoCita() {
  const descripcion = estadoCitaDescripcion.value.trim()
  if (!descripcion) return
  await safeAction(estadosCita.createItem({ descripcion }))
  estadoCitaDescripcion.value = ''
}

async function addMetodoPago() {
  const descripcion = metodoPagoDescripcion.value.trim()
  if (!descripcion) return
  await safeAction(metodosPago.createItem({ descripcion }))
  metodoPagoDescripcion.value = ''
}

async function addBarbero() {
  const nombre = barberoNombre.value.trim()
  if (!nombre || !barberoEspecialidadId.value || !barberoEstadoId.value) return

  await safeAction(
    barberos.createItem({
      nombre_completo: nombre,
      telefono: optionalText(barberoTelefono.value),
      especialidad_id: barberoEspecialidadId.value,
      estado_laboral_id: barberoEstadoId.value,
    }),
  )
  barberoNombre.value = ''
  barberoTelefono.value = ''
}

async function addCliente() {
  const nombre = clienteNombre.value.trim()
  if (!nombre) return

  await safeAction(
    clientes.createItem({
      nombre_completo: nombre,
      telefono: optionalText(clienteTelefono.value),
      correo_electronico: optionalText(clienteCorreo.value),
      fecha_registro: clienteFechaRegistro.value || null,
    }),
  )
  clienteNombre.value = ''
  clienteTelefono.value = ''
  clienteCorreo.value = ''
}

async function addServicio() {
  const nombre = servicioNombre.value.trim()
  const precio = Number.parseFloat(servicioPrecio.value)
  const duracion = Number.parseInt(servicioDuracion.value, 10)

  if (!nombre || !Number.isFinite(precio) || !Number.isFinite(duracion)) return

  await safeAction(
    servicios.createItem({
      nombre,
      precio,
      duracion_minutos: duracion,
    }),
  )
  servicioNombre.value = ''
  servicioPrecio.value = ''
  servicioDuracion.value = '30'
}

async function addCita() {
  if (
    !citaFecha.value ||
    !citaHora.value ||
    !citaClienteId.value ||
    !citaBarberoId.value ||
    !citaServicioId.value ||
    !citaEstadoId.value
  ) {
    return
  }

  await safeAction(
    citas.createItem({
      fecha_cita: citaFecha.value,
      hora_cita: citaHora.value,
      cliente_id: citaClienteId.value,
      barbero_id: citaBarberoId.value,
      servicio_id: citaServicioId.value,
      estado_cita_id: citaEstadoId.value,
    }),
  )
  citaHora.value = '09:00'
}

async function addFactura() {
  const total = Number.parseFloat(facturaTotal.value)
  if (!facturaMetodoPagoId.value || !facturaCitaId.value || !Number.isFinite(total)) return

  await safeAction(
    facturas.createItem({
      metodo_pago_id: facturaMetodoPagoId.value,
      total_pagado: total,
      cita_id: facturaCitaId.value,
    }),
  )
  facturaTotal.value = ''
}

const hasCatalogData = computed(
  () => especialidades.items.length || estadosLaborales.items.length || servicios.items.length,
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      title="BARBERÍA"
      subtitle="Administra especialidades, barberos, clientes, citas y facturas."
    />

    <div
      v-if="!hasCatalogData"
      class="rounded border border-accent/30 bg-accent/10 px-4 py-3 font-mono text-sm text-accent"
    >
      Ingresa especialidades, estados laborales y servicios antes de crear citas.
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <RetroPanel
        title="ESPECIALIDADES"
        :status="especialidades.loading ? '[ LOADING ]' : `[ ${especialidades.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addEspecialidad">
          <label class="field">
            <span class="field__label">DESCRIPCIÓN</span>
            <input v-model="especialidadDescripcion" class="field__input" type="text" />
          </label>

          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="especialidades.mutating">
              AGREGAR
            </button>
            <span v-if="especialidades.error" class="error-text">{{ especialidades.error }}</span>
          </div>
        </form>

        <ul v-if="especialidades.items.length" class="mt-4 space-y-2">
          <li v-for="item in especialidades.items" :key="item.id" class="list-item">
            <span class="font-display text-sm text-primary">{{ item.descripcion }}</span>
            <button
              class="danger-button"
              type="button"
              :disabled="especialidades.mutating"
              @click="safeAction(especialidades.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN ESPECIALIDADES.</p>
      </RetroPanel>

      <RetroPanel
        title="ESTADO LABORAL"
        :status="estadosLaborales.loading ? '[ LOADING ]' : `[ ${estadosLaborales.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addEstadoLaboral">
          <label class="field">
            <span class="field__label">DESCRIPCIÓN</span>
            <input v-model="estadoLaboralDescripcion" class="field__input" type="text" />
          </label>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="estadosLaborales.mutating">
              AGREGAR
            </button>
            <span v-if="estadosLaborales.error" class="error-text">{{ estadosLaborales.error }}</span>
          </div>
        </form>

        <ul v-if="estadosLaborales.items.length" class="mt-4 space-y-2">
          <li v-for="item in estadosLaborales.items" :key="item.id" class="list-item">
            <span class="font-display text-sm text-primary">{{ item.descripcion }}</span>
            <button
              class="danger-button"
              type="button"
              :disabled="estadosLaborales.mutating"
              @click="safeAction(estadosLaborales.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN ESTADOS LABORALES.</p>
      </RetroPanel>

      <RetroPanel
        title="SERVICIOS"
        :status="servicios.loading ? '[ LOADING ]' : `[ ${servicios.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addServicio">
          <label class="field">
            <span class="field__label">NOMBRE</span>
            <input v-model="servicioNombre" class="field__input" type="text" />
          </label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">PRECIO</span>
              <input v-model="servicioPrecio" class="field__input" type="number" min="0" />
            </label>
            <label class="field">
              <span class="field__label">DURACIÓN (MIN)</span>
              <input v-model="servicioDuracion" class="field__input" type="number" min="1" />
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="servicios.mutating">
              AGREGAR
            </button>
            <span v-if="servicios.error" class="error-text">{{ servicios.error }}</span>
          </div>
        </form>

        <ul v-if="servicios.items.length" class="mt-4 space-y-2">
          <li v-for="item in servicios.items" :key="item.id" class="list-item">
            <div>
              <p class="font-display text-sm text-primary">{{ item.nombre }}</p>
              <p class="font-mono text-[11px] text-muted">
                {{ currencyFormatter.format(item.precio) }} · {{ item.duracion_minutos }} min
              </p>
            </div>
            <button
              class="danger-button"
              type="button"
              :disabled="servicios.mutating"
              @click="safeAction(servicios.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN SERVICIOS.</p>
      </RetroPanel>

      <RetroPanel
        title="BARBEROS"
        :status="barberos.loading ? '[ LOADING ]' : `[ ${barberos.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addBarbero">
          <label class="field">
            <span class="field__label">NOMBRE COMPLETO</span>
            <input v-model="barberoNombre" class="field__input" type="text" />
          </label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">TELÉFONO</span>
              <input v-model="barberoTelefono" class="field__input" type="tel" />
            </label>
            <label class="field">
              <span class="field__label">ESPECIALIDAD</span>
              <select v-model="barberoEspecialidadId" class="field__input">
                <option v-for="item in especialidades.items" :key="item.id" :value="item.id">
                  {{ item.descripcion }}
                </option>
              </select>
            </label>
            <label class="field sm:col-span-2">
              <span class="field__label">ESTADO LABORAL</span>
              <select v-model="barberoEstadoId" class="field__input">
                <option v-for="item in estadosLaborales.items" :key="item.id" :value="item.id">
                  {{ item.descripcion }}
                </option>
              </select>
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="barberos.mutating">
              AGREGAR
            </button>
            <span v-if="barberos.error" class="error-text">{{ barberos.error }}</span>
          </div>
        </form>

        <ul v-if="barberos.items.length" class="mt-4 space-y-2">
          <li v-for="item in barberos.items" :key="item.id" class="list-item">
            <div>
              <p class="font-display text-sm text-primary">{{ item.nombre_completo }}</p>
              <p class="font-mono text-[11px] text-muted">
                {{ lookup(especialidadById, item.especialidad_id) }} ·
                {{ lookup(estadoLaboralById, item.estado_laboral_id) }}
              </p>
            </div>
            <button
              class="danger-button"
              type="button"
              :disabled="barberos.mutating"
              @click="safeAction(barberos.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN BARBEROS.</p>
      </RetroPanel>

      <RetroPanel
        title="CLIENTES"
        :status="clientes.loading ? '[ LOADING ]' : `[ ${clientes.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addCliente">
          <label class="field">
            <span class="field__label">NOMBRE COMPLETO</span>
            <input v-model="clienteNombre" class="field__input" type="text" />
          </label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">TELÉFONO</span>
              <input v-model="clienteTelefono" class="field__input" type="tel" />
            </label>
            <label class="field">
              <span class="field__label">CORREO</span>
              <input v-model="clienteCorreo" class="field__input" type="email" />
            </label>
            <label class="field sm:col-span-2">
              <span class="field__label">FECHA REGISTRO</span>
              <input v-model="clienteFechaRegistro" class="field__input" type="date" />
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="clientes.mutating">
              AGREGAR
            </button>
            <span v-if="clientes.error" class="error-text">{{ clientes.error }}</span>
          </div>
        </form>

        <ul v-if="clientes.items.length" class="mt-4 space-y-2">
          <li v-for="item in clientes.items" :key="item.id" class="list-item">
            <div>
              <p class="font-display text-sm text-primary">{{ item.nombre_completo }}</p>
              <p class="font-mono text-[11px] text-muted">
                {{ item.telefono || 'Sin teléfono' }} · {{ item.correo_electronico || 'Sin correo' }}
              </p>
            </div>
            <button
              class="danger-button"
              type="button"
              :disabled="clientes.mutating"
              @click="safeAction(clientes.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN CLIENTES.</p>
      </RetroPanel>

      <RetroPanel
        title="ESTADO CITA"
        :status="estadosCita.loading ? '[ LOADING ]' : `[ ${estadosCita.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addEstadoCita">
          <label class="field">
            <span class="field__label">DESCRIPCIÓN</span>
            <input v-model="estadoCitaDescripcion" class="field__input" type="text" />
          </label>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="estadosCita.mutating">
              AGREGAR
            </button>
            <span v-if="estadosCita.error" class="error-text">{{ estadosCita.error }}</span>
          </div>
        </form>

        <ul v-if="estadosCita.items.length" class="mt-4 space-y-2">
          <li v-for="item in estadosCita.items" :key="item.id" class="list-item">
            <span class="font-display text-sm text-primary">{{ item.descripcion }}</span>
            <button
              class="danger-button"
              type="button"
              :disabled="estadosCita.mutating"
              @click="safeAction(estadosCita.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN ESTADOS DE CITA.</p>
      </RetroPanel>

      <RetroPanel
        title="CITAS"
        :status="citas.loading ? '[ LOADING ]' : `[ ${citas.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addCita">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">FECHA</span>
              <input v-model="citaFecha" class="field__input" type="date" />
            </label>
            <label class="field">
              <span class="field__label">HORA</span>
              <input v-model="citaHora" class="field__input" type="time" />
            </label>
            <label class="field">
              <span class="field__label">CLIENTE</span>
              <select v-model="citaClienteId" class="field__input">
                <option v-for="item in clientes.items" :key="item.id" :value="item.id">
                  {{ item.nombre_completo }}
                </option>
              </select>
            </label>
            <label class="field">
              <span class="field__label">BARBERO</span>
              <select v-model="citaBarberoId" class="field__input">
                <option v-for="item in barberos.items" :key="item.id" :value="item.id">
                  {{ item.nombre_completo }}
                </option>
              </select>
            </label>
            <label class="field">
              <span class="field__label">SERVICIO</span>
              <select v-model="citaServicioId" class="field__input">
                <option v-for="item in servicios.items" :key="item.id" :value="item.id">
                  {{ item.nombre }}
                </option>
              </select>
            </label>
            <label class="field">
              <span class="field__label">ESTADO</span>
              <select v-model="citaEstadoId" class="field__input">
                <option v-for="item in estadosCita.items" :key="item.id" :value="item.id">
                  {{ item.descripcion }}
                </option>
              </select>
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="citas.mutating">
              AGREGAR
            </button>
            <span v-if="citas.error" class="error-text">{{ citas.error }}</span>
          </div>
        </form>

        <ul v-if="citas.items.length" class="mt-4 space-y-2">
          <li v-for="item in citas.items" :key="item.id" class="list-item">
            <div>
              <p class="font-display text-sm text-primary">
                {{ item.fecha_cita }} · {{ item.hora_cita }}
              </p>
              <p class="font-mono text-[11px] text-muted">
                {{ lookup(clienteById, item.cliente_id) }} ·
                {{ lookup(barberoById, item.barbero_id) }} ·
                {{ lookup(servicioById, item.servicio_id) }} ·
                {{ lookup(estadoCitaById, item.estado_cita_id) }}
              </p>
            </div>
            <button
              class="danger-button"
              type="button"
              :disabled="citas.mutating"
              @click="safeAction(citas.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN CITAS.</p>
      </RetroPanel>

      <RetroPanel
        title="MÉTODOS DE PAGO"
        :status="metodosPago.loading ? '[ LOADING ]' : `[ ${metodosPago.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addMetodoPago">
          <label class="field">
            <span class="field__label">DESCRIPCIÓN</span>
            <input v-model="metodoPagoDescripcion" class="field__input" type="text" />
          </label>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="metodosPago.mutating">
              AGREGAR
            </button>
            <span v-if="metodosPago.error" class="error-text">{{ metodosPago.error }}</span>
          </div>
        </form>

        <ul v-if="metodosPago.items.length" class="mt-4 space-y-2">
          <li v-for="item in metodosPago.items" :key="item.id" class="list-item">
            <span class="font-display text-sm text-primary">{{ item.descripcion }}</span>
            <button
              class="danger-button"
              type="button"
              :disabled="metodosPago.mutating"
              @click="safeAction(metodosPago.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN MÉTODOS DE PAGO.</p>
      </RetroPanel>

      <RetroPanel
        title="FACTURAS"
        :status="facturas.loading ? '[ LOADING ]' : `[ ${facturas.items.length} ]`"
      >
        <form class="space-y-3" @submit.prevent="addFactura">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">MÉTODO DE PAGO</span>
              <select v-model="facturaMetodoPagoId" class="field__input">
                <option v-for="item in metodosPago.items" :key="item.id" :value="item.id">
                  {{ item.descripcion }}
                </option>
              </select>
            </label>
            <label class="field">
              <span class="field__label">TOTAL</span>
              <input v-model="facturaTotal" class="field__input" type="number" min="0" />
            </label>
            <label class="field sm:col-span-2">
              <span class="field__label">CITA</span>
              <select v-model="facturaCitaId" class="field__input">
                <option v-for="item in citas.items" :key="item.id" :value="item.id">
                  {{ item.fecha_cita }} · {{ lookup(clienteById, item.cliente_id) }}
                </option>
              </select>
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="action-button" type="submit" :disabled="facturas.mutating">
              AGREGAR
            </button>
            <span v-if="facturas.error" class="error-text">{{ facturas.error }}</span>
          </div>
        </form>

        <ul v-if="facturas.items.length" class="mt-4 space-y-2">
          <li v-for="item in facturas.items" :key="item.id" class="list-item">
            <div>
              <p class="font-display text-sm text-primary">
                {{ currencyFormatter.format(item.total_pagado) }}
              </p>
              <p class="font-mono text-[11px] text-muted">
                {{ lookup(metodoPagoById, item.metodo_pago_id) }} ·
                {{ dateTimeFormatter.format(new Date(item.fecha_emision)) }}
              </p>
            </div>
            <button
              class="danger-button"
              type="button"
              :disabled="facturas.mutating"
              @click="safeAction(facturas.deleteItem(item.id))"
            >
              ELIMINAR
            </button>
          </li>
        </ul>
        <p v-else class="empty-text">SIN FACTURAS.</p>
      </RetroPanel>
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.field {
  @apply flex flex-col gap-1;
}

.field__label {
  @apply font-mono text-[11px] tracking-widest text-muted/70;
}

.field__input {
  @apply w-full rounded border border-primary/25 bg-background/70 px-3 py-2 font-mono text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none;
}

.action-button {
  @apply rounded border border-primary/35 bg-primary/10 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/20 disabled:opacity-60;
}

.danger-button {
  @apply rounded border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[10px] text-accent transition-colors hover:bg-accent/20 disabled:opacity-60;
}

.list-item {
  @apply flex items-center justify-between gap-3 rounded border border-primary/20 bg-background/50 px-3 py-2;
}

.error-text {
  @apply font-mono text-xs text-accent;
}

.empty-text {
  @apply mt-4 font-mono text-sm text-muted;
}
</style>
