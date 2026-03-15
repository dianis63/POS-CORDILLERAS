export const ventasDiarias = [
  { dia: "Lun", valor: 120 },
  { dia: "Mar", valor: 180 },
  { dia: "Mié", valor: 150 },
  { dia: "Jue", valor: 260 },
  { dia: "Vie", valor: 310 },
  { dia: "Sáb", valor: 380 },
  { dia: "Dom", valor: 400 },
];

export const ventasAnuales = [
  { mes: "Ene", valor: 120 },
  { mes: "Feb", valor: 160 },
  { mes: "Mar", valor: 155 },
  { mes: "Abr", valor: 180 },
  { mes: "May", valor: 210 },
  { mes: "Jun", valor: 380 },
  { mes: "Jul", valor: 400 },
  { mes: "Ago", valor: 100 },
  { mes: "Sep", valor: 140 },
  { mes: "Oct", valor: 160 },
  { mes: "Nov", valor: 240 },
  { mes: "Dic", valor: 290 },
];

export const categorias = [
  { nombre: "Bebidas calientes", porcentaje: 52.1, color: "#FAC5C3" },
  { nombre: "Postres",           porcentaje: 22.8, color: "#B0DEFF" },
  { nombre: "Bebidas frías",     porcentaje: 13.9, color: "#C5E9CD" },
  { nombre: "Otros",             porcentaje: 11.2, color: "#C8CEFC" },
];

export const productosVendidos = [
  { nombre: "Frappé",      valor: 20 },
  { nombre: "Latte",       valor: 15 },
  { nombre: "Alfajor",     valor: 10 },
  { nombre: "Frappuccino", valor: 7  },
];

export const productosVencer = [
  { nombre: "Leche entera",       tiempo: "Hace 20 minutos", dias: "1 día",  urgencia: "orange" },
  { nombre: "Leche deslactosada", tiempo: "Hace 2 horas",    dias: "3 días", urgencia: "orange" },
  { nombre: "Vainilla líquida",   tiempo: "Hace 15 horas",   dias: "5 días", urgencia: "gray"   },
];

export const productosAgotar = [
  { nombre: "Leche entera",       tiempo: "Hace 10 minutos", unidades: "1 unidad",   urgencia: "red"    },
  { nombre: "Leche deslactosada", tiempo: "Hace 3 horas",    unidades: "3 unidades", urgencia: "orange" },
  { nombre: "Canela en polvo",    tiempo: "Hace 20 horas",   unidades: "5 unidades", urgencia: "gray"   },
];

export const clientesIniciales = [
  { id: 1,  nombre: "Juan Alberto",    apellido: "Rodrigues Guerra",  correo: "juan.rodrigues1@gmail.com"   },
  { id: 2,  nombre: "María Fernanda",  apellido: "López Martínez",    correo: "maria.lopez23@gmail.com"     },
  { id: 3,  nombre: "Carlos Andrés",   apellido: "Pérez Hernández",   correo: "carlos.perez88@gmail.com"    },
  { id: 4,  nombre: "Ana Sofía",       apellido: "Ramírez Castro",    correo: "ana.ramirez14@gmail.com"     },
  { id: 5,  nombre: "Luis Eduardo",    apellido: "Gómez Torres",      correo: "luis.gomez90@gmail.com"      },
  { id: 6,  nombre: "Daniela Isabel",  apellido: "Morales Sánchez",   correo: "daniela.morales7@gmail.com"  },
  { id: 7,  nombre: "José Manuel",     apellido: "Herrera López",     correo: "jose.herrera55@gmail.com"    },
  { id: 8,  nombre: "Valeria Nicole",  apellido: "Cruz Martínez",     correo: "valeria.cruz11@gmail.com"    },
  { id: 9,  nombre: "Ricardo Antonio", apellido: "Flores Mejía",      correo: "ricardo.flores02@gmail.com"  },
  { id: 10, nombre: "Paola Alejandra", apellido: "Mendoza Ruiz",      correo: "paola.mendoza19@gmail.com"   },
  { id: 11, nombre: "Andrés Felipe",   apellido: "Vargas Cifuentes",  correo: "andres.vargas@gmail.com"     },
  { id: 12, nombre: "Sofía Isabel",    apellido: "Castillo Mejía",    correo: "sofia.castillo@gmail.com"    },
  { id: 13, nombre: "Miguel Ángel",    apellido: "Torres Rivas",      correo: "miguel.torres@gmail.com"     },
  { id: 14, nombre: "Laura Camila",    apellido: "Reyes Ospina",      correo: "laura.reyes@gmail.com"       },
  { id: 15, nombre: "Diego Alejandro", apellido: "Muñoz Peña",        correo: "diego.munoz@gmail.com"       },
  { id: 16, nombre: "Isabella",        apellido: "Gómez Ríos",        correo: "isabella.gomez@gmail.com"    },
  { id: 17, nombre: "Sebastián",       apellido: "Herrera Mora",      correo: "sebastian.herrera@gmail.com" },
  { id: 18, nombre: "Valentina",       apellido: "Castro Duque",      correo: "valentina.castro@gmail.com"  },
  { id: 19, nombre: "Mateo",           apellido: "Ruiz Salazar",      correo: "mateo.ruiz@gmail.com"        },
  { id: 20, nombre: "Camila Andrea",   apellido: "Parra Medina",      correo: "camila.parra@gmail.com"      },
];

export const CATEGORIAS = [
  "Bebida caliente",
  "Bebida fría",
  "Postres",
  "Snacks",
  "Otros",
];

export const productosIniciales = [
  { id: 1,  nombre: "Espresso",           categoria: "Bebida caliente", precioUnitario: 1.50, tamanio: "12 oz",     estado: true  },
  { id: 2,  nombre: "Americano",          categoria: "Bebida caliente", precioUnitario: 1.75, tamanio: "8 oz",      estado: true  },
  { id: 3,  nombre: "Cappuccino",         categoria: "Bebida caliente", precioUnitario: 2.50, tamanio: "16 oz",     estado: true  },
  { id: 4,  nombre: "Latte",              categoria: "Bebida caliente", precioUnitario: 2.75, tamanio: "16 oz",     estado: true  },
  { id: 5,  nombre: "Mocha",              categoria: "Bebida caliente", precioUnitario: 3.00, tamanio: "12 oz",     estado: false },
  { id: 6,  nombre: "Frappé de vainilla", categoria: "Bebida fría",     precioUnitario: 3.50, tamanio: "12 oz",     estado: true  },
  { id: 7,  nombre: "Té frío de durazno", categoria: "Bebida fría",     precioUnitario: 2.25, tamanio: "16 oz",     estado: true  },
  { id: 8,  nombre: "Brownie",            categoria: "Postres",         precioUnitario: 2.00, tamanio: "1 porción", estado: false },
  { id: 9,  nombre: "Cheesecake",         categoria: "Postres",         precioUnitario: 3.25, tamanio: "1 porción", estado: true  },
  { id: 10, nombre: "Alfajor",            categoria: "Postres",         precioUnitario: 2.50, tamanio: "1 porción", estado: true  },
  { id: 11, nombre: "Macchiato",          categoria: "Bebida caliente", precioUnitario: 2.00, tamanio: "8 oz",      estado: true  },
  { id: 12, nombre: "Cold Brew",          categoria: "Bebida fría",     precioUnitario: 3.00, tamanio: "16 oz",     estado: true  },
  { id: 13, nombre: "Muffin de arándano", categoria: "Postres",         precioUnitario: 1.75, tamanio: "1 porción", estado: true  },
  { id: 14, nombre: "Granola Bar",        categoria: "Snacks",          precioUnitario: 1.50, tamanio: "1 unidad",  estado: true  },
  { id: 15, nombre: "Matcha Latte",       categoria: "Bebida caliente", precioUnitario: 3.25, tamanio: "12 oz",     estado: true  },
];


export const insumosIniciales = [
  { id: 1,  nombre: "Café en grano",      medida: "kg",       stockActual: 8,   stockMinimo: 2,   precioCompra: 6.50, vencimiento: "2027-11-08", ultimaCompra: "2026-01-30" },
  { id: 2,  nombre: "Azúcar blanca",      medida: "kg",       stockActual: 12,  stockMinimo: 3,   precioCompra: 1.40, vencimiento: "2026-11-01", ultimaCompra: "2026-01-13" },
  { id: 3,  nombre: "Leche entera",       medida: "litros",   stockActual: 25,  stockMinimo: 8,   precioCompra: 0.95, vencimiento: "2026-06-12", ultimaCompra: "2026-01-27" },
  { id: 4,  nombre: "Leche deslactosada", medida: "litros",   stockActual: 10,  stockMinimo: 4,   precioCompra: 1.10, vencimiento: "2026-04-28", ultimaCompra: "2026-01-13" },
  { id: 5,  nombre: "Chocolate en polvo", medida: "kg",       stockActual: 5,   stockMinimo: 2,   precioCompra: 4.20, vencimiento: "2026-07-17", ultimaCompra: "2026-01-27" },
  { id: 6,  nombre: "Té en bolsitas",     medida: "unidades", stockActual: 80,  stockMinimo: 20,  precioCompra: 0.08, vencimiento: "2026-08-22", ultimaCompra: "2026-01-30" },
  { id: 7,  nombre: "Canela en polvo",    medida: "gr",       stockActual: 500, stockMinimo: 100, precioCompra: 0.02, vencimiento: "2026-11-29", ultimaCompra: "2026-01-26" },
  { id: 8,  nombre: "Vainilla líquida",   medida: "ml",       stockActual: 750, stockMinimo: 200, precioCompra: 0.01, vencimiento: "2026-09-01", ultimaCompra: "2026-01-15" },
  { id: 9,  nombre: "Harina de trigo",    medida: "kg",       stockActual: 15,  stockMinimo: 5,   precioCompra: 0.90, vencimiento: "2026-10-30", ultimaCompra: "2026-01-21" },
  { id: 10, nombre: "Mantequilla",        medida: "kg",       stockActual: 6,   stockMinimo: 2,   precioCompra: 3.80, vencimiento: "2027-01-25", ultimaCompra: "2026-01-15" },
  { id: 11, nombre: "Crema de leche",     medida: "litros",   stockActual: 8,   stockMinimo: 3,   precioCompra: 1.20, vencimiento: "2026-05-10", ultimaCompra: "2026-01-20" },
  { id: 12, nombre: "Cacao en polvo",     medida: "kg",       stockActual: 4,   stockMinimo: 1,   precioCompra: 3.50, vencimiento: "2026-12-01", ultimaCompra: "2026-01-18" },
  { id: 13, nombre: "Stevia",             medida: "gr",       stockActual: 200, stockMinimo: 50,  precioCompra: 0.05, vencimiento: "2027-03-15", ultimaCompra: "2026-01-10" },
  { id: 14, nombre: "Sirope de vainilla", medida: "ml",       stockActual: 500, stockMinimo: 100, precioCompra: 0.03, vencimiento: "2026-08-01", ultimaCompra: "2026-01-22" },
  { id: 15, nombre: "Sal",               medida: "kg",       stockActual: 3,   stockMinimo: 1,   precioCompra: 0.50, vencimiento: "2028-01-01", ultimaCompra: "2026-01-05" },
];

export const categoriasIniciales = [
  { id: 1, nombre: "Bebidas calientes", descripcion: "Bebidas servidas a alta temperatura como café, té y chocolate." },
  { id: 2, nombre: "Bebidas frías",     descripcion: "Bebidas servidas frías o con hielo, como frappés, jugos y refrescos." },
  { id: 3, nombre: "Postres",           descripcion: "Productos dulces como pasteles, galletas y otros acompañamientos." },
  { id: 4, nombre: "Snacks",            descripcion: "Botanas y productos ligeros para acompañar bebidas." },
  { id: 5, nombre: "Otros",             descripcion: "Productos que no encajan en las categorías anteriores." },
];

export const categoriasPDV = [
  { key: "bebidas-frias",    label: "Beb. Frías",     icon: "🥤" },
  { key: "bebidas-calientes", label: "Beb. Calientes", icon: "☕" },
  { key: "postres",          label: "Postres",         icon: "🧁" },
  { key: "pizzas",           label: "Pizzas",          icon: "🍕" },
];

export const productosPDV = [
  { id: 1, nombre: "Frappé de vainilla",  categoria: "bebidas-frias",     talla: "12 oz", precio: 3.50 },
  { id: 2, nombre: "Té frío de durazno",  categoria: "bebidas-frias",     talla: "16 oz", precio: 2.25 },
  { id: 3, nombre: "Espresso",            categoria: "bebidas-calientes",  talla: "2 oz",  precio: 1.50 },
  { id: 4, nombre: "Latte",               categoria: "bebidas-calientes",  talla: "12 oz", precio: 3.00 },
  { id: 5, nombre: "Cheesecake",          categoria: "postres",            talla: null,    precio: 2.50 },
  { id: 6, nombre: "Brownie",             categoria: "postres",            talla: null,    precio: 3.25 },
  { id: 7, nombre: "Pizza Margherita",    categoria: "pizzas",             talla: 'Personal', precio: 5.00 },
  
];

export const ventasGuardadas = [
  { id: "3421697104782", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "sin-pagar" },
  { id: "3421697104783", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "sin-pagar" },
  { id: "3421697104784", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "sin-pagar" },
  { id: "3421697104785", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "sin-pagar" },
  { id: "3421697104786", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "pagado"    },
  { id: "3421697104787", cliente: "Lucero", total: 13.00, hora: "03:29 PM", fecha: "Octubre 16, 2026", productos: 5, nota: "---", estado: "pagado"    },
];

export const empleadosIniciales = [
  { id: 1,  nombre: "Karen Cecilia",   apellido: "Medina López",     telefono: "7255-7298", cargo: "Gerente",          salario: 750.00 },
  { id: 2,  nombre: "Luis Alberto",    apellido: "Pérez Gómez",      telefono: "7312-4589", cargo: "Barista",          salario: 450.00 },
  { id: 3,  nombre: "María José",      apellido: "Hernández Cruz",   telefono: "7245-1187", cargo: "Cajera",           salario: 420.00 },
  { id: 4,  nombre: "Carlos Daniel",   apellido: "Ramírez López",    telefono: "7880-3345", cargo: "Barista",          salario: 450.00 },
  { id: 5,  nombre: "Ana Lucía",       apellido: "Torres Mejía",     telefono: "7213-9087", cargo: "Mesera",           salario: 400.00 },
  { id: 6,  nombre: "José Miguel",     apellido: "Castro Flores",    telefono: "7654-3211", cargo: "Cocinero",         salario: 480.00 },
  { id: 7,  nombre: "Daniela Sofía",   apellido: "Rivas Sánchez",    telefono: "7011-5066", cargo: "Barista",          salario: 450.00 },
  { id: 8,  nombre: "Roberto Andrés",  apellido: "Morales Díaz",     telefono: "7383-8890", cargo: "Auxiliar de cocina", salario: 420.00 },
  { id: 9,  nombre: "Valeria Fernanda",apellido: "Aguilar Ruiz",     telefono: "7444-1023", cargo: "Cajera",           salario: 420.00 },
  { id: 10, nombre: "Andrea Nicole",   apellido: "Flores Hernández", telefono: "7555-3344", cargo: "Mesero",           salario: 450.00 },
  { id: 11, nombre: "Diego Alejandro", apellido: "Vásquez Moreno",   telefono: "7221-4433", cargo: "Barista",          salario: 450.00 },
  { id: 12, nombre: "Sofía Valentina", apellido: "Cruz Portillo",    telefono: "7667-2211", cargo: "Cajera",           salario: 420.00 },
];

export const ventasTotalesData = [
  { id: "000001", cliente: "Carlos Méndez",   cantidadProductos: 2, totalVenta: 4.50,  fecha: "2026-01-08", hora: "08:15 a.m." },
  { id: "000002", cliente: "Laura Pérez",      cantidadProductos: 1, totalVenta: 2.25,  fecha: "2026-01-08", hora: "08:47 a.m." },
  { id: "000003", cliente: "José Ramírez",     cantidadProductos: 4, totalVenta: 9.00,  fecha: "2026-01-08", hora: "09:10 a.m." },
  { id: "000004", cliente: "María López",      cantidadProductos: 3, totalVenta: 6.75,  fecha: "2026-01-08", hora: "09:55 a.m." },
  { id: "000005", cliente: "Andrés Castillo",  cantidadProductos: 2, totalVenta: 4.50,  fecha: "2026-01-08", hora: "10:20 a.m." },
  { id: "000006", cliente: "Sofía Hernández",  cantidadProductos: 1, totalVenta: 2.50,  fecha: "2026-01-08", hora: "11:05 a.m." },
  { id: "000007", cliente: "Luis Matínez",     cantidadProductos: 5, totalVenta: 11.25, fecha: "2026-01-08", hora: "11:40 a.m." },
  { id: "000008", cliente: "Daniela Gómez",    cantidadProductos: 2, totalVenta: 4.75,  fecha: "2026-01-08", hora: "12:15 p.m." },
  { id: "000009", cliente: "Miguel Torres",    cantidadProductos: 3, totalVenta: 7.50,  fecha: "2026-01-08", hora: "01:05 p.m." },
  { id: "000010", cliente: "Elena Vargas",     cantidadProductos: 1, totalVenta: 2.00,  fecha: "2026-01-08", hora: "01:45 p.m." },
];

export const ventasProductosData = [
  { nombre: "Espresso",           cantidadProductos: 5, tamanio: "12 oz",     precioUnitario: 1.50, total: 7.50,  fecha: "2026-01-08" },
  { nombre: "Americano",          cantidadProductos: 3, tamanio: "8 oz",      precioUnitario: 1.75, total: 5.25,  fecha: "2026-01-08" },
  { nombre: "Cappuccino",         cantidadProductos: 4, tamanio: "16 oz",     precioUnitario: 2.50, total: 10.00, fecha: "2026-01-08" },
  { nombre: "Latte",              cantidadProductos: 6, tamanio: "16 oz",     precioUnitario: 2.75, total: 16.50, fecha: "2026-01-08" },
  { nombre: "Mocha",              cantidadProductos: 2, tamanio: "12 oz",     precioUnitario: 3.00, total: 7.00,  fecha: "2026-01-08" },
  { nombre: "Frappé de vainilla", cantidadProductos: 3, tamanio: "12 oz",     precioUnitario: 3.50, total: 6.75,  fecha: "2026-01-08" },
  { nombre: "Té frío de durazno", cantidadProductos: 4, tamanio: "16 oz",     precioUnitario: 2.25, total: 13.00, fecha: "2026-01-08" },
  { nombre: "Brownie",            cantidadProductos: 5, tamanio: "1 porción", precioUnitario: 2.00, total: 12.50, fecha: "2026-01-08" },
  { nombre: "Cheesecake",         cantidadProductos: 3, tamanio: "1 porción", precioUnitario: 3.25, total: 4.50,  fecha: "2026-01-08" },
  { nombre: "Alfajor",            cantidadProductos: 2, tamanio: "1 porción", precioUnitario: 2.50, total: 5.50,  fecha: "2026-01-08" },
];

export const ventasCategoriasData = [
  { categoria: "Bebidas calientes", cantidadProductos: 20, total: 46.25, fecha: "2026-01-08" },
  { categoria: "Bebidas frías",     cantidadProductos: 7,  total: 19.65, fecha: "2026-01-08" },
  { categoria: "Postres",           cantidadProductos: 10, total: 7.75,  fecha: "2026-01-08" },
];

export const auditoriaData = [
  { idReporte: "000001", idUsuario: "000001", tipoReporte: "Ventas diarias",       fechaReporte: "2026-01-08" },
  { idReporte: "000002", idUsuario: "000001", tipoReporte: "Ventas por productos", fechaReporte: "2026-01-08" },
  { idReporte: "000003", idUsuario: "000001", tipoReporte: "Ventas por categoría", fechaReporte: "2026-01-08" },
  { idReporte: "000004", idUsuario: "000001", tipoReporte: "Ventas diarias",       fechaReporte: "2026-01-09" },
  { idReporte: "000005", idUsuario: "000001", tipoReporte: "Ventas por productos", fechaReporte: "2026-01-09" },
  { idReporte: "000006", idUsuario: "000001", tipoReporte: "Ventas por categoría", fechaReporte: "2026-01-09" },
  { idReporte: "000007", idUsuario: "000001", tipoReporte: "Ventas diarias",       fechaReporte: "2026-01-10" },
  { idReporte: "000008", idUsuario: "000001", tipoReporte: "Ventas por productos", fechaReporte: "2026-01-10" },
  { idReporte: "000009", idUsuario: "000001", tipoReporte: "Ventas por categoría", fechaReporte: "2026-01-10" },
  { idReporte: "000010", idUsuario: "000001", tipoReporte: "Ventas diarias",       fechaReporte: "2026-01-11" },
];