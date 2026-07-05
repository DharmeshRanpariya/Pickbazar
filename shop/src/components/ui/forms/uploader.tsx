import { useEffect, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import { UploadIcon } from '@/components/icons/upload-icon';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUploads } from '@/framework/settings';

interface UploaderProps {
  onChange: (files: string[]) => void;
  value: string[] | null;
  name: string;
  onBlur?: () => void;
  multiple?: boolean;
}

const Uploader = ({ onChange, value = [], name, onBlur, multiple = false }: UploaderProps) => {
  const { t } = useTranslation('common');
  const parsedValue = Array.isArray(value) ? value : [];
  const { mutate: upload, isLoading } = useUploads({
    onChange: (files: any[]) => {
      const uploadedUrls = files.map((file) => file.photoUrl);
      const updatedFiles = multiple ? [...parsedValue, ...uploadedUrls] : uploadedUrls;
      onChange(updatedFiles);
    },
    defaultFiles: parsedValue.map((url) => ({ url })),
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ preview: string; url: string }[]>(
    parsedValue.map((url) => ({ preview: url, url })),
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const previewFiles = acceptedFiles.map((file) => ({
        preview: URL.createObjectURL(file),
        url: '',
      }));
      const newUploadedFiles = multiple
        ? [...uploadedFiles, ...previewFiles]
        : previewFiles;
      setUploadedFiles(newUploadedFiles);
      upload(acceptedFiles);
    },
    [upload, uploadedFiles, multiple],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple,
    onDrop,
  });

  useEffect(() => {
    return () => {
      uploadedFiles?.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [uploadedFiles]);

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input {...getInputProps({ name, onBlur })} />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-sm text-center text-body">
          <span className="font-semibold text-accent">{t('text-upload-highlight')}</span>{' '}
          {t('text-upload-message')} <br />
          <span className="text-xs text-body">{t('text-img-format')}</span>
        </p>
      </div>

      <aside className="flex flex-wrap mt-2">
        {uploadedFiles?.map((file, idx) => (
          <div
            className="relative inline-flex flex-col mt-2 overflow-hidden border rounded border-border-100 ltr:mr-2 rtl:ml-2"
            key={idx}
          >
            <div className="flex items-center justify-center w-16 h-16 min-w-0 overflow-hidden">
              <img src={file.preview || file.url} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center h-16 mt-2 ltr:ml-2 rtl:mr-2">
            <Spinner text={t('text-loading')} simple={true} className="w-6 h-6" />
          </div>
        )}
      </aside>
    </section>
  );
};

export default Uploader;
