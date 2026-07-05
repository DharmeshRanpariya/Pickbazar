import { Controller } from 'react-hook-form';
import Uploader from '@/components/ui/forms/uploader';

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
}

const FileInput = ({ control, name, multiple }: FileInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={multiple ? [] : ''}
      render={({ field: { onChange, value, onBlur } }) => (
        <Uploader
          onChange={(files) => onChange(files)}
          value={value || []}
          name={name}
          onBlur={onBlur}
          multiple={multiple}
        />
      )}
    />
  );
};

export default FileInput;
