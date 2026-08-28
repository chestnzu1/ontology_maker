export async function GET() {
  return Response.json([
    {
      id: '1',
      name: 'Thing',
      uri: 'http://www.w3.org/2002/07/owl#Thing',
      description: 'The most general OWL class',
    },
    {
      id: '2',
      name: 'Class',
      uri: 'http://www.w3.org/2000/01/rdf-schema#Class',
      description: 'RDF Schema Class',
    },
    {
      id: '3',
      name: 'Agent',
      uri: 'http://xmlns.com/foaf/0.1/Agent',
      description: 'FOAF Agent - describes a person or organization',
    },
    {
      id: '4',
      name: 'Person',
      uri: 'http://xmlns.com/foaf/0.1/Person',
      description: 'FOAF Person - represents a person',
    },
    {
      id: '5',
      name: 'Organization',
      uri: 'http://xmlns.com/foaf/0.1/Organization',
      description: 'FOAF Organization',
    },
  ])
}
