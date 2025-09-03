
import { Card, CardContent } from '@/components/ui/card';

const CompanyInfo = () => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-gray-700 font-medium">System developed by</span>
          <span className="font-bold text-blue-600">ELONDA</span>
          <span className="text-red-500">❤️</span>
        </div>
        <p className="text-sm text-gray-600">
          For technical support, contact: 
          <a href="mailto:mugiranezaelisee0@gmail.com" className="text-blue-600 hover:underline ml-1">
            mugiranezaelisee0@gmail.com
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
