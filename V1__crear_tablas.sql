

-- ============================================================
-- RambedCash - Script inicial de base de datos
-- V1__crear_tablas.sql
-- ============================================================

-- ============================================================
-- TABLA: usuarios
-- Personas que pueden iniciar sesión en la app
-- ============================================================
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    rol         VARCHAR(20)  NOT NULL DEFAULT 'USUARIO',
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: categorias
-- Las "claves" que usas en Excel para clasificar cada movimiento
-- Ejemplos: Insumos, Confección, Ventas, Intereses, Envíos...
-- ============================================================
CREATE TABLE categorias (
    id                  SERIAL PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL UNIQUE,
    tipo_movimiento     VARCHAR(10)  NOT NULL,
    clasificacion       VARCHAR(30)  NOT NULL,
    activa              BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_tipo_movimiento
        CHECK (tipo_movimiento IN ('INGRESO', 'EGRESO')),

    CONSTRAINT chk_clasificacion
        CHECK (clasificacion IN (
            'INGRESO_OPERACIONAL',
        	'INGRESO_NO_OPERACIONAL',
        	'COSTO_VENTA',
        	'GASTO_FIJO',
        	'GASTO_ADMINISTRATIVO',
        	'GASTO_VENTAS',
        	'PAGO_DEUDA_ANTERIOR',
        	'RETIRO_INVERSIONISTA'
        ))
);

-- ============================================================
-- TABLA: saldos
-- Guarda el saldo actual de caja (efectivo) y banco
-- Se actualiza cada vez que se registra un movimiento
-- ============================================================
CREATE TABLE saldos (
    id                  SERIAL PRIMARY KEY,
    saldo_efectivo      NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    saldo_banco         NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    fecha_actualizacion TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: movimientos
-- Cada ingreso o egreso que se registra en el día
-- Es la tabla principal de la app
-- ============================================================
CREATE TABLE movimientos (
    id              SERIAL PRIMARY KEY,
    fecha           DATE           NOT NULL,
    descripcion     VARCHAR(255)   NOT NULL,
    valor           NUMERIC(15,2)  NOT NULL,
    tipo            VARCHAR(10)    NOT NULL,
    medio_pago      VARCHAR(10)    NOT NULL,
    categoria_id    INTEGER        NOT NULL,
    usuario_id      INTEGER        NOT NULL,
    creado_en       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tipo
        CHECK (tipo IN ('INGRESO', 'EGRESO')),

    CONSTRAINT chk_medio_pago
        CHECK (medio_pago IN ('EFECTIVO', 'BANCO')),

    CONSTRAINT chk_valor_positivo
        CHECK (valor > 0),

    CONSTRAINT fk_movimiento_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id),

    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================================================
-- TABLA: prestamos
-- Préstamos activos con seguimiento de capital e intereses
-- ============================================================
CREATE TABLE prestamos (
    id                  SERIAL PRIMARY KEY,
    descripcion         VARCHAR(150)  NOT NULL,
    entidad             VARCHAR(100)  NOT NULL,
    valor_original      NUMERIC(15,2) NOT NULL,
    saldo_pendiente     NUMERIC(15,2) NOT NULL,
    tasa_interes        NUMERIC(5,2)  NOT NULL,
    fecha_inicio        DATE          NOT NULL,
    fecha_vencimiento   DATE,
    activo              BOOLEAN       NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_valor_original
        CHECK (valor_original > 0),

    CONSTRAINT chk_saldo_pendiente
        CHECK (saldo_pendiente >= 0),

    CONSTRAINT chk_tasa_interes
        CHECK (tasa_interes >= 0)
);

-- ============================================================
-- TABLA: pagos_prestamo
-- Cada pago que se hace a un préstamo
-- Queda vinculado también a un movimiento en la tabla movimientos
-- ============================================================
CREATE TABLE pagos_prestamo (
    id                  SERIAL PRIMARY KEY,
    prestamo_id         INTEGER       NOT NULL,
    movimiento_id       INTEGER       NOT NULL,
    valor_capital       NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    valor_interes       NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    fecha_pago          DATE          NOT NULL,
    creado_en           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pago_prestamo
        FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),

    CONSTRAINT fk_pago_movimiento
        FOREIGN KEY (movimiento_id) REFERENCES movimientos(id)
);

-- ============================================================
-- DATOS INICIALES: saldo en cero
-- ============================================================
INSERT INTO saldos (saldo_efectivo, saldo_banco)
VALUES (0.00, 0.00);

-- ============================================================
-- DATOS INICIALES: categorias base de Rambed
-- ============================================================
INSERT INTO categorias (nombre, tipo_movimiento, clasificacion) VALUES
('Bancos',               'EGRESO',  'GASTO_ADMINISTRATIVO'),
('Transporte',           'EGRESO',  'GASTO_VENTAS'),
('Trazos',               'EGRESO',  'COSTO_VENTA'),
('Confección',           'EGRESO',  'COSTO_VENTA'),
('Insumos',              'EGRESO',  'COSTO_VENTA'),
('Nómina',               'EGRESO',  'GASTO_FIJO'),
('Arriendo y otros',     'EGRESO',  'GASTO_ADMINISTRATIVO'),
('Corte',                'EGRESO',  'COSTO_VENTA'),
('Diseño',               'EGRESO',  'COSTO_VENTA'),
('Lavanderías',          'EGRESO',  'COSTO_VENTA'),
('Ventas',               'INGRESO', 'INGRESO_OPERACIONAL'),
('Rambed comisión',      'EGRESO',  'GASTO_VENTAS'),
('Yaq comisión',         'EGRESO',  'GASTO_VENTAS'),
('John comisión',        'EGRESO',  'GASTO_VENTAS'),
('Viáticos',             'EGRESO',  'GASTO_VENTAS'),
('Intereses',            'EGRESO',  'GASTO_ADMINISTRATIVO'),
('Pago deuda anterior',  'EGRESO',  'PAGO_DEUDA_ANTERIOR'),
('Retiro inversionista', 'EGRESO',  'RETIRO_INVERSIONISTA'),
('Venta de activos',     'INGRESO', 'INGRESO_NO_OPERACIONAL');
