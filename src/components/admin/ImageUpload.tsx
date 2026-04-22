import { useRef, useState } from 'react';
import { api } from '../../lib/api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="img-upload-field">
      <span className="field-label">{label}</span>
      <div
        className={`img-upload-zone${value ? ' has-image' : ''}${uploading ? ' loading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {uploading ? (
          <div className="img-upload-status">
            <div className="img-upload-spinner" />
            <span>Uploading…</span>
          </div>
        ) : value ? (
          <>
            <img className="img-upload-preview" src={value} alt="Preview" />
            <div className="img-upload-overlay">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Change image</span>
            </div>
          </>
        ) : (
          <div className="img-upload-status">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Click or drag to upload</span>
            <span className="img-upload-hint">PNG, JPG, WebP — max 5 MB</span>
          </div>
        )}
      </div>
      {value && !uploading && (
        <button type="button" className="img-upload-remove" onClick={() => onChange('')}>
          Remove image
        </button>
      )}
      {error && <div className="img-upload-error">{error}</div>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onInput} />
    </div>
  );
}
