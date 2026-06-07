/**
 * SOFTWARE DATA MANAGEMENT
 * 
 * This file contains all software entries for the directory.
 * To add new software, copy an existing entry and update the fields.
 * 
 * Quick Guide:
 * 1. Each software needs a unique 'id' (lowercase with hyphens)
 * 2. Update thumbnail with your image URL or use Unsplash
 * 3. For videos, use YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
 * 4. Fill in shortDescription for the overview
 * 5. Fill in advancedDescription for technical users
 * 
 */

// Software data model - designed for easy migration to database
export interface Software {
  id: string;
  name: string;
  tagline: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  shortDescription: string;
  features: string[];
  techStack: string[];
  advancedDescription: {
    overview: string;
    technicalDetails: string[];
    apiIntegrations?: string[];
    scalability?: string;
    security?: string;
  };
  demoUrl?: string;
  githubUrl?: string;
  pricing?: {
    model: string;
    startingPrice?: string;
  };
  featured?: boolean;
  popularity?: number;
}

// Sample software entries
export const softwareData: Software[] = [
  {
    id: "inventory-pro",
    featured: true,
    name: "Inventory Pro",
    tagline: "Sistema avanzado de gestión de inventario",
    category: "Gestión Empresarial",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/g7xkVEWrX8E",
    shortDescription: "Una solución integral de gestión de inventario diseñada para negocios en crecimiento. Controla niveles de stock, gestiona proveedores y genera reportes detallados con análisis en tiempo real.",
    features: [
      "Seguimiento de inventario en tiempo real",
      "Alertas automáticas de reposición",
      "Soporte multi-bodega",
      "Integración con escáner de códigos de barras",
      "Panel de análisis detallado",
      "Gestión de proveedores",
      "Exportación de reportes (CSV, PDF, Excel)"
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
    advancedDescription: {
      overview: "Inventory Pro está construido sobre una arquitectura de microservicios con despliegue en contenedores Docker y orquestación Kubernetes. El sistema maneja transacciones de alto volumen con patrones de consistencia eventual e implementa CQRS para un rendimiento óptimo de lectura/escritura.",
      technicalDetails: [
        "API RESTful con capa de consultas GraphQL para obtención flexible de datos",
        "Arquitectura orientada a eventos usando RabbitMQ para procesamiento asíncrono",
        "Capa de caché Redis con tiempos de respuesta inferiores a 50 ms en datos frecuentes",
        "PostgreSQL con réplicas de lectura para escalado horizontal",
        "Autenticación JWT con rotación de refresh tokens",
        "Limitación de tasa: 1000 solicitudes/minuto por clave API",
        "Conexiones WebSocket para actualizaciones de inventario en tiempo real",
        "Respaldos automáticos cada 6 horas con recuperación a punto en el tiempo"
      ],
      apiIntegrations: [
        "Stripe para procesamiento de pagos",
        "SendGrid para correos transaccionales",
        "Twilio para alertas SMS",
        "AWS S3 para almacenamiento de documentos",
        "Shopify, WooCommerce y plataformas de e-commerce personalizadas"
      ],
      scalability: "El sistema está diseñado para soportar más de 10.000 usuarios concurrentes con infraestructura de auto-escalado. Las pruebas de carga muestran rendimiento estable con inventarios de más de 1M de SKUs.",
      security: "Cumple SOC 2 Tipo II con cifrado de extremo a extremo, control de acceso basado en roles (RBAC) y registro de auditoría completo. Pruebas de penetración y auditorías de seguridad trimestrales."
    },
    demoUrl: "https://demo.inventorypro.example.com",
    pricing: {
      model: "Suscripción",
      startingPrice: "$99/mes"
    },
    popularity: 95
  },
  {
    id: "analytics-hub",
    name: "Analytics Hub",
    tagline: "Plataforma de análisis de datos para empresas",
    category: "Datos & Analítica",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/g7xkVEWrX8E",
    shortDescription: "Transforma datos en bruto en información accionable. Analytics Hub ofrece potentes herramientas de visualización, paneles personalizados y analítica predictiva con IA para tomar decisiones basadas en datos.",
    features: [
      "Paneles personalizables",
      "Más de 50 tipos de gráficos y visualizaciones",
      "Insights y predicciones con IA",
      "Streaming de datos en tiempo real",
      "Reportes colaborativos",
      "Conectores para más de 100 fuentes de datos",
      "Opciones de marca blanca disponibles"
    ],
    techStack: ["TypeScript", "Python", "Apache Kafka", "ClickHouse", "TensorFlow"],
    advancedDescription: {
      overview: "Analytics Hub aprovecha una arquitectura moderna de data lakehouse que combina lo mejor de los data warehouses y los data lakes. Construido sobre Apache Kafka para procesamiento de streams y ClickHouse para consultas OLAP, la plataforma puede ingerir y analizar miles de millones de eventos al día.",
      technicalDetails: [
        "Base de datos columnar (ClickHouse) optimizada para consultas analíticas",
        "Apache Kafka para ingesta en tiempo real con semántica exactly-once",
        "Formato Delta Lake para transacciones ACID en el data lake",
        "Optimización de consultas con vistas materializadas y pre-agregación",
        "Computación distribuida con Apache Spark para procesamiento por lotes",
        "Modelos de ML basados en TensorFlow para detección de anomalías y forecasting",
        "APIs GraphQL y REST con documentación autogenerada",
        "Soporte SSO: SAML 2.0, OAuth 2.0, LDAP/Active Directory"
      ],
      apiIntegrations: [
        "Google BigQuery, Amazon Redshift, Snowflake",
        "MySQL, PostgreSQL, MongoDB, Cassandra",
        "Salesforce, HubSpot, Marketo",
        "Google Analytics, Mixpanel, Segment",
        "Integraciones personalizadas vía webhook"
      ],
      scalability: "Arquitectura escalable horizontalmente que soporta conjuntos de datos a escala de petabytes. Auto-escalado del clúster según la carga de consultas con tiempos de respuesta sub-segundo para agregaciones sobre miles de millones de filas.",
      security: "Cumple con GDPR y CCPA con funciones de anonimización. Cifrado a nivel de columna, control de acceso a nivel de campo y trazabilidad completa de datos. Certificación ISO 27001."
    },
    demoUrl: "https://demo.analyticshub.example.com",
    pricing: {
      model: "Empresarial a medida",
      startingPrice: "Consultar precio"
    },
    popularity: 82
  },
  {
    id: "taskflow-manager",
    name: "TaskFlow Manager",
    tagline: "Gestión inteligente de proyectos y tareas",
    category: "Productividad",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/g7xkVEWrX8E",
    shortDescription: "Optimiza el flujo de trabajo de tu equipo con priorización de tareas asistida por IA, programación automática y seguimiento intuitivo de proyectos. Ideal para equipos ágiles y colaboración remota.",
    features: [
      "Priorización de tareas con IA",
      "Diagramas de Gantt y tableros Kanban",
      "Registro y reportes de tiempo",
      "Herramientas de colaboración en equipo",
      "Disparadores automáticos de flujos de trabajo",
      "Apps móviles (iOS y Android)",
      "Integración con más de 50 herramientas"
    ],
    techStack: ["Next.js", "Go", "MongoDB", "Elasticsearch", "OpenAI API"],
    advancedDescription: {
      overview: "TaskFlow Manager combina la gestión de proyectos tradicional con insights basados en IA. El sistema usa machine learning para analizar datos históricos de proyectos y entregar recomendaciones inteligentes para la asignación de tareas, plazos y distribución de recursos.",
      technicalDetails: [
        "Renderizado del lado del servidor con Next.js para SEO y rendimiento óptimos",
        "Microservicios en Go para procesamiento en segundo plano de alto rendimiento",
        "MongoDB con sharding para escalabilidad horizontal",
        "Elasticsearch para búsqueda de texto completo con latencia inferior a 100 ms",
        "Embeddings vectoriales para búsqueda semántica de tareas con OpenAI",
        "Colaboración en tiempo real vía WebRTC y operational transformation",
        "Patrón event sourcing para una auditoría completa",
        "Pipeline CI/CD con pruebas automatizadas (95% de cobertura de código)"
      ],
      apiIntegrations: [
        "Slack, Microsoft Teams, Discord",
        "GitHub, GitLab, Bitbucket",
        "Jira, Asana, Monday.com (import/export)",
        "Google Calendar, Outlook Calendar",
        "Zapier para automatización de flujos personalizados"
      ],
      scalability: "Diseñado para equipos de 5 a más de 5.000 personas. Despliegue multi-región con replicación activa-activa. Soporta más de 50.000 conexiones WebSocket concurrentes por instancia de servidor.",
      security: "Cifrado de extremo a extremo para datos sensibles. Cumple con SOC 2, HIPAA y GDPR. Autenticación de dos factores obligatoria para planes empresariales. Sistema de permisos detallado con más de 20 roles granulares."
    },
    demoUrl: "https://demo.taskflow.example.com",
    pricing: {
      model: "Freemium",
      startingPrice: "Gratis hasta 10 usuarios"
    },
    popularity: 90
  }
];

// Helper function to get software by ID
export function getSoftwareById(id: string): Software | undefined {
  return softwareData.find(software => software.id === id);
}

// Helper function to get software by category (for future filtering)
export function getSoftwareByCategory(category: string): Software[] {
  return softwareData.filter(software => software.category === category);
}

// Get all unique categories
export function getCategories(): string[] {
  return Array.from(new Set(softwareData.map(software => software.category)));
}