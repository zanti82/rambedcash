# 💰 RambedCash

Sistema de control de flujo de caja diseñado para microempresas del sector textil colombiano. Permite registrar ingresos y egresos diarios, controlar saldos en efectivo y banco, gestionar préstamos y generar reportes financieros para contabilidad.

---

## ¿Qué problema resuelve?

Las microempresas textiles suelen llevar su flujo de caja en Excel de forma manual. RambedCash digitaliza ese proceso, automatiza los cálculos y genera reportes listos para el contador, diferenciando gastos operacionales, pagos de deudas anteriores y retiros de inversionistas.

---

## Funcionalidades principales

- Registro de ingresos y egresos con categoría, medio de pago (efectivo o banco) y fecha
- Saldo en tiempo real de caja y banco
- Gestión de préstamos con seguimiento de capital e intereses
- Dashboard con resumen diario, semanal y mensual
- Gráficas de comportamiento financiero
- Estado de resultados mensual (utilidad bruta, operacional y neta)
- Exportación de reportes para contador en Excel y PDF
- Clasificación de movimientos: gastos fijos, administrativos, pagos de deuda anterior y retiros de inversionistas

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React |
| Backend | Java Spring Boot |
| Autenticación | JWT |
| Base de datos | PostgreSQL |
| Infraestructura | Docker / Docker Compose |

---

## Estructura del proyecto

```
rambedcash/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   └── src/main/java/com/rambedcash/
│       ├── auth/
│       ├── usuario/
│       ├── movimiento/
│       ├── categoria/
│       ├── prestamo/
│       └── reporte/
└── frontend/
    ├── Dockerfile
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── context/
```

---

## Cómo correr el proyecto

### Requisitos
- Docker y Docker Compose instalados

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/rambedcash.git
cd rambedcash

# 2. Levantar todos los servicios
docker-compose up --build

# 3. Acceder a la app
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Base de datos: puerto 5432
```

---

## Modelo de datos principal

```
usuarios → movimientos ← categorias
                ↑
            prestamos
```

Cada movimiento tiene: fecha, descripción, valor, tipo (INGRESO/EGRESO), medio de pago (EFECTIVO/BANCO) y una categoría con clasificación contable.

---

## Clasificaciones contables

| Clasificación | Flujo de caja | Estado de resultados |
|---|---|---|
| GASTO_FIJO | ✅ | ✅ |
| GASTO_ADMINISTRATIVO | ✅ | ✅ |
| COSTO_VENTA | ✅ | ✅ |
| INGRESO_OPERACIONAL | ✅ | ✅ |
| PAGO_DEUDA_ANTERIOR | ✅ | ❌ |
| RETIRO_INVERSIONISTA | ✅ | ❌ |

---

## Estado del proyecto

- [x] Diseño de arquitectura
- [x] Modelo de base de datos
- [ ] Backend Spring Boot
- [ ] Frontend React
- [ ] Dockerización
- [ ] Módulo estado de resultados

---

## Autor

Desarrollado como proyecto de portafolio personal.  
Sector objetivo: microempresas textiles colombianas.
