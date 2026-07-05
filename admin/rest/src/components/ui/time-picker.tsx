import ValidationError from '@/components/ui/form-validation-error';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useTranslation } from 'next-i18next';
import TimePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';

interface TimePickerInputProps {
  control: any;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  name: string;
  label?: string;
  toolTipText?: string;
  required?: boolean;
  error?: string;
  timeFormat?: string;
  className?: string;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  control,
  minDate,
  locale,
  disabled,
  placeholder = 'Select Time',
  name,
  label,
  toolTipText,
  required,
  error,
  timeFormat = 'HH:mm',
  className,
  maxDate,
  ...rest
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      {label ? (
        <TooltipLabel
          htmlFor={name}
          toolTipText={toolTipText}
          label={label}
          required={required}
        />
      ) : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <TimePicker
              {...field}
              selected={field?.value ? new Date(field?.value) : null}
              locale={locale}
              placeholderText={placeholder}
              disabled={disabled}
              showTimeSelect
              showTimeSelectOnly
              timeFormat={timeFormat}
              dateFormat={timeFormat}
              className={className}
            />
          );
        }}
        {...rest}
      />
      <ValidationError message={error} />
    </>
  );
};

export default TimePickerInput;
