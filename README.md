# Financial Ontology Builder

A web-based tool for building financial domain ontologies in Turtle (RDF) format with intelligent parent class suggestions from established financial ontologies.

## Features

- **Interactive UI** to add and manage ontology classes
- **Curated parent class suggestions** from FIBO (Financial Industry Business Ontology) and other standards
- **Hierarchy visualization** showing class relationships
- **Turtle format export** ready for semantic web applications
- **Dark/Light mode support** 

## Quick Start

1. Open `index.html` in your browser
2. Enter a class name (e.g., "BankAccount")
3. Select a parent class from the suggested financial ontology references
4. Add a description
5. Click "Add Class"
6. Generate and export Turtle format ontology

## Included Reference Classes

The tool comes with 20 pre-defined financial ontology reference classes:
- Thing, Entity, Party, Financial Instrument
- Asset, Liability, Product, Account
- Transaction, Agreement, Security, Derivative
- Equity, Debt, Currency, Price
- Portfolio, Counterparty, Organization, Person

## Use Cases

- Building semantic layers for financial applications
- Creating domain-specific financial ontologies
- Organizing financial data hierarchies
- Generating RDF/OWL ontologies for knowledge graphs

## Running Locally

Simply open `index.html` in a modern web browser. No server or dependencies required.

## Export Format

The tool generates valid Turtle (TTL) format ontologies with:
- RDF and OWL prefix declarations
- Class definitions with labels and comments
- Subclass relationships to parent ontologies
- Namespace URIs for your domain

## License

MIT
