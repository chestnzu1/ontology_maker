# Financial Ontology Builder

A modern web application for building and managing financial domain ontologies in Turtle (RDF) format. Built with Next.js, TypeScript, and SQLite.

## Features

- **Interactive Ontology Editor** - Create and manage ontologies with an intuitive UI
- **Reference Ontology Management** - Pre-load and customize reference ontologies (like FIBO)
- **Class Hierarchy** - Define classes and their parent relationships
- **Turtle Export** - Generate standard Turtle format ontologies
- **File Downloads** - Export ontologies as `.ttl` files
- **Persistent Storage** - SQLite database to save your work
- **Clean API** - RESTful API for ontology and reference data management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with dark theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ontology_maker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
cp .env.example .env
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ontology_maker/
├── app/
│   ├── api/                 # API routes
│   │   ├── ontologies/      # Ontology CRUD operations
│   │   └── reference-ontologies/  # Reference ontology management
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── OntologyBuilder.tsx # Main app component
│   ├── OntologyEditor.tsx  # Editor for ontologies
│   ├── ClassForm.tsx       # Form to add classes
│   ├── ClassList.tsx       # Display classes
│   ├── TurtleExport.tsx    # Export to Turtle format
│   ├── OntologyList.tsx    # List saved ontologies
│   └── ReferenceOntologyManager.tsx  # Manage reference ontologies
├── prisma/
│   └── schema.prisma       # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Endpoints

### Reference Ontologies
- `GET /api/reference-ontologies` - List all reference ontologies
- `POST /api/reference-ontologies` - Create a new reference ontology
- `PUT /api/reference-ontologies/[id]` - Update a reference ontology
- `DELETE /api/reference-ontologies/[id]` - Delete a reference ontology

### Ontologies
- `GET /api/ontologies` - List all ontologies
- `POST /api/ontologies` - Create a new ontology
- `GET /api/ontologies/[id]` - Get ontology details
- `PUT /api/ontologies/[id]` - Update an ontology
- `DELETE /api/ontologies/[id]` - Delete an ontology

### Ontology Classes
- `POST /api/ontologies/[id]/classes` - Add a class to an ontology
- `DELETE /api/ontologies/[id]/classes/[classId]` - Delete a class

## Database Schema

### ReferenceOntology
- `id`: Unique identifier
- `name`: Name of the reference ontology
- `uri`: URI of the ontology
- `description`: Description of the reference ontology
- `createdAt`, `updatedAt`: Timestamps

### Ontology
- `id`: Unique identifier
- `name`: Name of the ontology
- `namespace`: Namespace URI
- `description`: Optional description
- `turtleData`: Generated Turtle format data
- `createdAt`, `updatedAt`: Timestamps

### OntologyClass
- `id`: Unique identifier
- `name`: Class name
- `namespace`: Namespace URI
- `parentClass`: Parent class name
- `description`: Optional description
- `ontologyId`: Foreign key to Ontology
- `createdAt`, `updatedAt`: Timestamps

## Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Database URL
DATABASE_URL="file:./dev.db"

# Next.js public API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

For production, use a cloud database like PostgreSQL or MongoDB.

## Integration with Personal Website

To integrate this app into your personal website:

1. Deploy this as a standalone Next.js app
2. Add a link on your personal website pointing to this app
3. The app will be accessible at your deployment URL

## Contributing

This is a personal project. Feel free to fork and customize for your needs.

## License

MIT
