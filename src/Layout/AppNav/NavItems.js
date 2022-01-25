export const MainNav = [
    {
        icon: 'pe-7s-rocket',
        label: 'Dashboard',
        to: '#/dashboard/dashboard',
    },
];
export const ProfileNav = [
    {
        icon: 'pe-7s-id',
        label: 'Empresa',
        content: [
            {
                label: 'Perfil',
                to: '#/empresa/perfil'
            },
            {
                label: 'Establecimientos',
                to: '#/empresa/establecimientos',
            }
        ]
    }
];
export const InventoriesNav = [
    {
        icon: 'pe-7s-note2',
        label: 'Inventarios',
        content: [
            {
                label: 'Productos',
                to: '#/inventarios/productos',
            },
            // {
            //     label: 'Movimientos',
            //     to: '#/inventarios/movimientos',
            // },
            // {
            //     label: 'Categorias',
            //     to: '#/inventarios/categorias',
            // },
            // {
            //     label: 'Unidades',
            //     to: '#/inventarios/unidades',
            // }
        ],
    },
];
export const InvoicesNav = [
    {
        icon: 'pe-7s-news-paper',
        label: 'Facturación',
        content: [
            {
                label: 'Documentos',
                to: '#/facturacion/documentos',
            }
        ],
    },
];
export const OrdersNav = [
    {
        icon: 'pe-7s-ticket',
        label: 'Ventas',
        to: '#/ventas/facturas'
    },
];
export const ShopsNav = [
    {
        icon: 'pe-7s-cart',
        label: 'Compras',
        to: '#/compras/facturas',
    },
];
export const ReferralGuidesNav = [
    {
        icon: 'pe-7s-news-paper',
        label: 'Guias de remisión',
        to: '#/guiasremision/index',
    },
];
export const ContactsNav = [
    {
        icon: 'pe-7s-users',
        label: 'Contactos',
        content: [
            {
                label: 'Clientes',
                to: '#/contactos/clientes',
            },
            {
                label: 'Proveedores',
                to: '#/contactos/proveedores',
            },
            {
                label: 'Transportistas',
                to: '#/contactos/transportistas',
            }
        ],
    },
];
export const AppointmentNav = [
    {
        icon: 'pe-7s-light',
        label: 'Nómina',
        content: [
            {
                label: 'Nómina',
                to: '#/inventorios/productos',
            }
        ],
    },
];
export const TaxationNav = [
    {
        icon: 'pe-7s-light',
        label: 'Tributación',
        content: [
            {
                label: 'Nómina',
                to: '#/inventorios/productos',
            }
        ],
    },
];
export const AccountingNav = [
    {
        icon: 'pe-7s-notebook',
        label: 'Contabilidad',
        content: [
            {
                label: 'Plan de cuentas',
                to: '#/contabilidad/plandecuentas',
            },
            {
                label: 'Libro diario',
                to: '#/contabilidad/librodiario',
            },
            {
                label: 'Libro mayor',
                to: '#/contabilidad/libromayor',
            },
            {
                label: 'Balance de comprobación',
                to: '#/contabilidad/balancedecompras',
            },
            {
                label: 'Perdidas y ganancias',
                to: '#/contabilidad/perdidasyganancias',
            },
            {
                label: 'Balance general',
                to: '#/contabilidad/balancegeneral',
            }
        ],
    },
];