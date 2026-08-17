import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToImgBB } from '../../utils/imgbbUpload';

export const ImageUploader = ({
  value = '',
  onChange,
  label = 'Upload Image',
  error,
  required = false,
  maxSizeMB = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value || '');
  const fileInputRef = useRef(null);

  // Cache last uploaded file to avoid duplicate uploads
  const lastFileRef = useRef(null);
  const lastUrlRef = useRef('');

  useEffect(() => {
    setUrlInputValue(value || '');
  }, [value]);

  const handleFileSelected = async (file) => {
    if (!file) return;

    // Check if same file was already uploaded
    if (lastFileRef.current && lastFileRef.current.name === file.name && lastFileRef.current.size === file.size && lastUrlRef.current) {
      onChange?.(lastUrlRef.current);
      return;
    }

    setLocalError('');
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const imgUrl = await uploadToImgBB(file, (progress) => {
        setUploadProgress(progress);
      });

      lastFileRef.current = file;
      lastUrlRef.current = imgUrl;

      onChange?.(imgUrl);
      setUrlInputValue(imgUrl);
      toast.success('Image uploaded successfully to ImgBB!');
    } catch (err) {
      setLocalError(err.message || 'Image upload failed.');
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange?.('');
    setUrlInputValue('');
    lastFileRef.current = null;
    lastUrlRef.current = '';
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInputValue) {
      onChange?.(urlInputValue);
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Use File Upload' : 'Paste Image URL'}</span>
        </button>
      </div>

      {/* URL Paste Input Fallback */}
      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            key="url-input"
            type="url"
            value={urlInputValue || ''}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="https://i.ibb.co/..."
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
          >
            Set URL
          </button>
        </div>
      ) : value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden group bg-slate-50">
          <img src={value} alt="Uploaded Preview" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ImgBB Ready</span>
          </div>
        </div>
      ) : (
        /* Drag & Drop Dropzone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isUploading
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-slate-100/80'
          }`}
        >
          <input
            key="file-input"
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-800">Uploading image to ImgBB ({uploadProgress}%)...</p>
              <div className="w-48 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                <div className="bg-emerald-600 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center mx-auto shadow-2xs">
                <Upload className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Click to upload or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP or GIF (Max {maxSizeMB}MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {(error || localError) && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error || localError}</span>
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
