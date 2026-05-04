import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Code,
  Award,
  Upload,
  Search,
  Filter,
  Download,
  ExternalLink,
  Star,
  Loader,
  AlertCircle,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { getFileUrl } from '../../services/urlConfig';

interface Evidence {
  _id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  description: string;
  linked_to?: {
    _id: string;
    title: string;
    organization: string;
  } | null;
  upload_date: string;
}

export default function EvidenceVault() {
  const [uploadedFiles, setUploadedFiles] = useState<Evidence[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch evidence from backend on mount
  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getEvidence();
      if (response.success && response.data) {
        setUploadedFiles(response.data);
        console.log('✅ Evidence loaded:', response.data.length, 'files');
      }
    } catch (error) {
      console.error('❌ Failed to fetch evidence:', error);
      setUploadStatus({
        type: 'error',
        message: 'Failed to load evidence. Please refresh the page.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeFromMime = (mimeType: string): string => {
    if (mimeType.includes('image')) return 'media';
    if (mimeType.includes('video')) return 'media';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('text')) return 'document';
    if (mimeType.includes('word')) return 'document';
    return 'document';
  };

  const typeIcons = {
    project: Code,
    document: FileText,
    certification: Award,
    media: Video,
    achievement: Award,
    link: LinkIcon,
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFileUpload(files);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const uploadedFilesData: Evidence[] = [];
      const errors: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('description', file.name);

          console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

          const result = await apiClient.uploadEvidence(formData);

          if (!result.success || !result.data) {
            throw new Error('Upload failed: Invalid response');
          }

          uploadedFilesData.push(result.data);
          console.log(`✅ Uploaded: ${file.name} → ${result.data.filename}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ Failed to upload ${file.name}:`, errorMsg);
          errors.push(`${file.name}: ${errorMsg}`);
        }
      }

      if (uploadedFilesData.length > 0) {
        setUploadedFiles([...uploadedFilesData, ...uploadedFiles]);
        setUploadStatus({
          type: 'success',
          message: `✅ Successfully uploaded ${uploadedFilesData.length} file${uploadedFilesData.length !== 1 ? 's' : ''}`,
        });
      }

      if (errors.length > 0) {
        setUploadStatus({
          type: 'error',
          message: `⚠️ Failed to upload ${errors.length} file${errors.length !== 1 ? 's' : ''}: ${errors.join('; ')}`,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Upload error:', errorMsg);
      setUploadStatus({
        type: 'error',
        message: `❌ Upload failed: ${errorMsg}`,
      });
    } finally {
      setIsUploading(false);
      // Clear status after 5 seconds
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  const handleDelete = async (evidenceId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      setDeletingId(evidenceId);
      const response = await apiClient.deleteEvidence(evidenceId);
      if (response.success) {
        setUploadedFiles(uploadedFiles.filter((f) => f._id !== evidenceId));
        setUploadStatus({
          type: 'success',
          message: '✅ File deleted successfully',
        });
        console.log('✅ Evidence deleted:', evidenceId);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to delete evidence:', errorMsg);
      setUploadStatus({
        type: 'error',
        message: `❌ Failed to delete file: ${errorMsg}`,
      });
    } finally {
      setDeletingId(null);
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  const filteredItems = uploadedFiles.filter((item) => {
    const matchesSearch =
      item.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const fileType = getFileTypeFromMime(item.file_type);
    const matchesFilter = filterType === 'all' || fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading evidence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">Evidence Vault</h2>
        <p className="text-muted-foreground">
          Upload and organize evidence of your skills, projects, and achievements
        </p>
      </div>

      {/* Upload Section */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload Evidence</h3>
        <p className="text-muted-foreground mb-6">
          Drag and drop your files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
          disabled={isUploading}
        />
        <label htmlFor="file-input">
          <button
            onClick={() => document.getElementById('file-input')?.click()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader className="w-4 h-4 inline mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Choose Files'
            )}
          </button>
        </label>
      </div>

      {/* Upload Status Message */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            uploadStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={uploadStatus.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
            {uploadStatus.message}
          </p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="project">Projects</option>
            <option value="document">Documents</option>
            <option value="certification">Certifications</option>
            <option value="media">Media</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>
      </div>

      {/* Evidence Grid */}
      <div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} {filterType !== 'all' && `· Showing ${filterType}s`}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const fileType = getFileTypeFromMime(item.file_type);
              const IconComponent = typeIcons[fileType] || FileText;
              return (
                <EvidenceCard 
                  key={item._id} 
                  item={item} 
                  IconComponent={IconComponent}
                  onDelete={handleDelete}
                  isDeleting={deletingId === item._id}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {uploadedFiles.length === 0
                ? 'No evidence uploaded yet. Start by uploading your first file!'
                : 'No evidence matches your search.'}
            </p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold mb-4">📋 What Evidence to Upload</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">💼 Projects</p>
            <p className="text-muted-foreground">GitHub repos, code samples, live demos</p>
          </div>
          <div>
            <p className="font-medium mb-2">🏆 Certifications</p>
            <p className="text-muted-foreground">Certificates, course completion, credentials</p>
          </div>
          <div>
            <p className="font-medium mb-2">📄 Documents</p>
            <p className="text-muted-foreground">Offer letters, recommendations, testimonials</p>
          </div>
          <div>
            <p className="font-medium mb-2">🎥 Media</p>
            <p className="text-muted-foreground">Videos, presentations, portfolio screenshots</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ item, IconComponent, onDelete, isDeleting }: { 
  item: Evidence; 
  IconComponent: any;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}) {
  try {
    const fileUrl = getFileUrl(item.filename);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <div className="bg-card border border-border rounded-xl hover:border-primary/50 transition-colors overflow-hidden group">
        {/* Icon Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          {item.linked_to && (
            <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              ✓ Linked
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold truncate group-hover:text-primary transition-colors" title={item.original_name}>
              {item.original_name.replace(/\.[^/.]+$/, '')}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(item.upload_date)}</p>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          )}

          {item.linked_to && (
            <div className="text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded">
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Linked to:</span> {item.linked_to.title}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">{item.linked_to.organization}</p>
            </div>
          )}

          {/* File Info */}
          <div className="text-xs text-muted-foreground">
            <p>
              {formatFileSize(item.file_size)} · {item.file_type}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border gap-2">
            <div className="flex-1" />
            <div className="flex gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-muted rounded transition-colors hover:text-primary"
                title="View/Download"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onDelete(item._id)}
                disabled={isDeleting}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                title="Delete"
              >
                {isDeleting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering evidence card:', error);
    return (
      <div className="bg-card border border-red-200 dark:border-red-900 rounded-xl p-4">
        <p className="text-red-600 dark:text-red-400 text-sm">Error displaying file</p>
      </div>
    );
  }
}
