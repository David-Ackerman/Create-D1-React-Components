export default (componentName: string) =>
  `import React from 'react';
import { FlexContent, Typography } from 'd1-components';
  
type Props = {
  name: string;
}

/**
 * @export
 * @component
 * @name ${componentName}
 * 
 * @description
 * Responsável por conter o componente ${componentName} 
 */

export const ${componentName} = ({ name }: Props) => {
  return (
    <FlexContent center verticalTop>
      <Typography color="#9196AB">${componentName}</Typography>
    </FlexContent>
  );
}
`;
