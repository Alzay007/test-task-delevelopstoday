import React from 'react';
import { Model } from '../../types/vehicleTypes';

interface ModelListProps {
  models: Model[];
}

const ModelList: React.FC<ModelListProps> = ({ models }) => {
  return (
    <ul>
      {models.map((model) => (
        <li key={model.Model_ID} className="p-2 border-b">
          {model.Model_Name}
        </li>
      ))}
    </ul>
  );
};

export default ModelList;
