import React, { useEffect } from 'react';
import { X, Download, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AttachmentViewerModal({ attachment, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!attachment) return null;

  const isPdf = attachment.type?.includes('pdf') || attachment.name?.toLowerCase().endsWith('.pdf');
  const isImage = attachment.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(attachment.name || '');

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.name || 'attachment';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className={`p-2 rounded-lg ${isPdf ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-slate-800 truncate">
                {attachment.name}
              </h3>
              <p className="text-xs text-slate-500">
                {isPdf ? 'PDF Document' : 'Image'} • {formatSize(attachment.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center min-h-[350px]">
          {isImage ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center">
              <img
                src={attachment.dataUrl}
                alt={attachment.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md bg-white"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[70vh] flex flex-col bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
              <iframe
                src={attachment.dataUrl}
                title={attachment.name}
                className="w-full flex-1 border-none"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="font-semibold text-slate-800 mb-1">{attachment.name}</p>
              <p className="text-xs text-slate-500 mb-4">Preview not available for this file type.</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
