

import { Card } from '@/components/ui/card';
import { useAnalysisStore } from '@/lib/store';
import { DUMMY_DETECTIONS, DUMMY_IMAGES } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';

export default function DetectionDetails() {
  const { selectedImageId, detections } = useAnalysisStore();

  const selectedImage = selectedImageId
    ? DUMMY_IMAGES.find((img) => img.id === selectedImageId)
    : null;

  const imageDetections = selectedImageId
    ? detections.filter((det) => det.imageId === selectedImageId)
    : detections;

  if (!selectedImage && detections.length === 0) {
    return (
      <Card className="p-6 bg-white border border-slate-200 text-center">
        <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Select an image to view detection details</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      {selectedImage && (
        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Image Information</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-24 h-24 rounded object-cover border border-slate-200"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{selectedImage.name}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Uploaded: {new Date(selectedImage.uploadDate).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600">
                  Location: {selectedImage.location.lat.toFixed(4)}, {selectedImage.location.lng.toFixed(4)}
                </p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">
                  {selectedImage.detectionCount} Detections
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Detections List */}
      <Card className="p-4 bg-white border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">
          AI Detections ({imageDetections.length})
        </h3>

        {imageDetections.length === 0 ? (
          <p className="text-slate-600 text-sm">No detections found for this image</p>
        ) : (
          <div className="space-y-3">
            {imageDetections.map((detection) => (
              <div
                key={detection.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">{detection.label}</p>
                    <p className="text-xs text-slate-600">
                      Type: <span className="font-mono">{detection.type}</span>
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {(detection.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>

                {/* Bounding Box Info */}
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    Position: x={detection.boundingBox.x}, y={detection.boundingBox.y}
                  </p>
                  <p>
                    Size: {detection.boundingBox.width}×{detection.boundingBox.height}px
                  </p>
                  <p>
                    Detected: {new Date(detection.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full"
                    style={{ width: `${detection.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Detection Stats */}
      {imageDetections.length > 0 && (
        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Detection Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Total Detections</p>
              <p className="text-2xl font-bold text-slate-900">
                {imageDetections.length}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-slate-900">
                {(
                  (imageDetections.reduce((sum, d) => sum + d.confidence, 0) /
                    imageDetections.length) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div>
              <p className="text-slate-600">Most Confident</p>
              <p className="text-lg font-bold text-slate-900">
                {(Math.max(...imageDetections.map((d) => d.confidence)) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-slate-600">Detection Types</p>
              <p className="text-lg font-bold text-slate-900">
                {new Set(imageDetections.map((d) => d.type)).size}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
