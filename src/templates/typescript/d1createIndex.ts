export default (componentName: string) =>
  `import { ${componentName} } from './${componentName}';
  
  export default ${componentName};
  `;
