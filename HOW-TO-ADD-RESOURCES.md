# Adding resources to Science Vault WA

The website now uses one central file: `resources.js`.

Each resource is one object in `window.SCIENCE_VAULT_RESOURCES`.

Required fields:
- id
- title
- year
- course
- strand
- unit
- topic
- subtopic
- type
- format
- answers
- file
- preview
- description

Example:

{
  id:"y10-rates-worksheet-01",
  title:"Rates of Reaction Worksheet",
  year:"Year 10",
  course:"Year 10 Science",
  strand:"Chemical sciences",
  unit:"",
  topic:"Rates of reaction",
  subtopic:"Collision model",
  type:"Worksheet",
  format:"PDF",
  answers:true,
  file:"resources/year10/chemical/rates/rates-worksheet.pdf",
  preview:"resources/year10/chemical/rates/rates-worksheet.pdf",
  description:"Practice questions on collision theory and factors affecting reaction rate."
}

Put the physical file inside the resources folder and use that relative path in file/preview.
