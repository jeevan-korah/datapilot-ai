import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText } from 'lucide-react';
import { Message } from '../../types';
import { VisualizationRenderer } from './VisualizationRenderer';

interface QueryOutputProps {
  isLoading: boolean;
  output: Message | null;
}

export function QueryOutput({ isLoading, output }: QueryOutputProps) {
  return (
    <Card className="min-h-[400px]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <FileText className="h-4 w-4 text-green-600" />
          </div>
          <CardTitle className="text-base">Query Output</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Processing query...</p>
            </div>
          </div>
        ) : output ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">{output.content}</p>
            {output.visualization && (
              <div className="mt-4">
                <VisualizationRenderer visualization={output.visualization} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-gray-400">Submit a query to see results here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
