
import React from 'react';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  label: string;
  id: string;
  file: File | null;
  onChange: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, id, file, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <Label className="block mb-2">{label}</Label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-music-red hover:text-red-500">
              <span>Upload a file</span>
              <input 
                id={id}
                name={id}
                type="file" 
                className="sr-only"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          {file && (
            <p className="text-sm text-green-600">{file.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
