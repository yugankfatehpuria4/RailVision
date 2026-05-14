

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAnalysisStore } from '@/lib/store';
import { DUMMY_IMAGES, DUMMY_DETECTIONS } from '@/lib/dummy-data';
import { Upload, MapPin, Calendar } from 'lucide-react';

export default function ImageUploadForm() {
  const [fileName, setFileName] = useState('');
  const [latitude, setLatitude] = useState('19.076');
  const [longitude, setLongitude] = useState('72.8479');
  const [isLoading, setIsLoading] = useState(false);
  const { addImage, addDetections } = useAnalysisStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with dummy data
    setTimeout(() => {
      const newImageId = `img-${Date.now()}`;
      const newImage = {
        id: newImageId,
        name: fileName || `Railway Image - ${new Date().toLocaleString()}`,
        uploadDate: new Date().toISOString(),
        location: {
          lat: parseFloat(latitude) || 19.076,
          lng: parseFloat(longitude) || 72.8479,
        },
        url: 'https://via.placeholder.com/640x480?text=Uploaded+Railway+Image',
        detectionCount: Math.floor(Math.random() * 5) + 1,
        processedDate: new Date().toISOString(),
      };

      // Add random detections from dummy data linked to this image
      const randomDetections = DUMMY_DETECTIONS.slice(0, 3).map((det) => ({
        ...det,
        imageId: newImageId,
        id: `${det.id}-${newImageId}`,
      }));

      addImage(newImage);
      addDetections(randomDetections);

      // Reset form
      setFileName('');
      setLatitude('19.076');
      setLongitude('72.8479');
      setIsLoading(false);

      alert(`✓ Image uploaded and processed! ${newImage.detectionCount} detections found.`);
    }, 1500);
  };

  return (
    <Card className="p-6 bg-white border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Railway Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Image
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            disabled={isLoading}
          />
          {fileName && (
            <p className="text-xs text-slate-500 mt-1">Selected: {fileName}</p>
          )}
        </div>

        {/* Location Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Latitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="19.076"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Longitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="72.8479"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoading ? 'Processing...' : 'Upload & Analyze'}
        </Button>

        {/* Info Text */}
        <p className="text-xs text-slate-500 text-center">
          Using demo data - image will be processed with AI detection
        </p>
      </form>

      {/* Recent Images */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Sample Images</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {DUMMY_IMAGES.map((img) => (
            <div
              key={img.id}
              className="p-2 bg-slate-50 rounded border border-slate-200 text-xs"
            >
              <p className="font-medium text-slate-900">{img.name}</p>
              <p className="text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {img.location.lat.toFixed(3)}, {img.location.lng.toFixed(3)}
              </p>
              <p className="text-slate-600 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(img.uploadDate).toLocaleDateString()}
              </p>
              <p className="text-blue-600 mt-1">Detections: {img.detectionCount}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
