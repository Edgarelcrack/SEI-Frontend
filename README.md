


# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```



/src/app/
├── data/
│   └── software.ts          # Software entries (easily expandable)
├── pages/
│   ├── Home.tsx             # Homepage with software grid
│   ├── SoftwareDetail.tsx   # Individual software pages
│   ├── Services.tsx         # Development services
│   ├── Root.tsx             # Layout wrapper
│   └── NotFound.tsx         # 404 page
├── components/
│   ├── Header.tsx           # Navigation
│   ├── Footer.tsx           # Footer
│   ├── SoftwareCard.tsx     # Software card component
│   ├── ScrollToTop.tsx      # Auto-scroll on route change
│   └── PageTitle.tsx        # Dynamic page titles
├── routes.tsx               # Route configuration
└── App.tsx                  # Application entry point
