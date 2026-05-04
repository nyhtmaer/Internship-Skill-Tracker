import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export default function EvidenceVault() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const typeIcons = {
    project: Code,
    document: FileText,
    certification: Award,
    media: Video,
    achievement: Award,
    link: LinkIcon,
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      const uploadedFilesData = [];
      const errors = [];
      
      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          console.log(`📤 Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
          
          const result = await apiClient.uploadEvidence(formData);
          
          // result format: { success: true, filename: "uuid.ext" }
          if (!result.filename) {
            throw new Error('No filename returned from server');
          }
          
          const uploadedFile = {
            id: Date.now() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            type: 'document',
            filename: result.filename,
            format: file.type.split('/')[1] || 'file',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            tags: [file.type.split('/')[0]],
            linkedTo: [],
            description: file.name,
            url: `http://localhost:5000/uploads/${result.filename}`,
            featured: false,
            impact: 'medium',
          };
          
          uploadedFilesData.push(uploadedFile);
          console.log(`✅ Uploaded: ${file.name} → ${result.filename}`);
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

  const filteredItems = uploadedFiles.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
              const IconComponent = typeIcons[item.type] || FileText;
              return (
                <EvidenceCard key={item.id} item={item} IconComponent={IconComponent} />
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

function EvidenceCard({ item, IconComponent }) {
  const impactColors = {
    high: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    low: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
  };

  return (
    <div className="bg-card border border-border rounded-xl hover:border-primary/50 transition-colors overflow-hidden group">
      {/* Icon Header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-start justify-between">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        {item.featured && (
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
        </div>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Impact Badge & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className={`text-xs font-medium px-2 py-1 rounded ${impactColors[item.impact]}`}>
            {item.impact === 'high' ? '⭐' : item.impact === 'medium' ? '📌' : '○'} {item.impact}
          </span>
          <div className="flex gap-2">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="View"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button className="p-1.5 hover:bg-muted rounded transition-colors" title="Download">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
