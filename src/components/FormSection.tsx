
import React from 'react';
import { FormSection as IFormSection } from '../types/form';
import FormField from './FormField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionProps {
  section: IFormSection;
  formData: { [key: string]: any };
  onChange: (fieldId: string, value: any) => void;
  errors: { [key: string]: string };
}

const FormSection: React.FC<FormSectionProps> = ({ section, formData, onChange, errors }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={formData[field.fieldId]}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default FormSection;
