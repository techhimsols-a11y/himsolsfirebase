import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ServiceRequest {
  id: string;
  requestId: string;
  type: 'TREE_PLANTATION' | 'WASTE_MANAGEMENT' | 'ENVIRONMENTAL_CONSULTING' | 'ECO_TOURISM' | 'OTHER';
  status: 'PENDING' | 'IN_PROCESS' | 'VERIFICATION' | 'FULFILLED' | 'CANCELLED';
  customerName: string;
  customerEmail?: string;
  customerMobile: string;
  customerAddress: string;
  customerPincode: string;
  customerNotes?: string;
  total?: number;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CertificateGeneratorProps {
  serviceRequest: ServiceRequest;
  children: React.ReactNode;
  isBirthdayWish?: boolean; // New prop for birthday wishes
  customMessage?: string; // Custom congratulatory message
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ 
  serviceRequest, 
  children, 
  isBirthdayWish = false, 
  customMessage 
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [showBirthdayWish, setShowBirthdayWish] = useState(isBirthdayWish);

  // Handle birthday wish checkbox change
  const handleBirthdayWishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowBirthdayWish(checked);
    
    // Add visual feedback with toast-like alert
    if (checked) {
      alert('🎂 Birthday wish will be included in the certificate!');
      console.log('Birthday wish enabled for:', serviceRequest.customerName);
    } else {
      alert('Birthday wish removed from certificate');
      console.log('Birthday wish disabled for:', serviceRequest.customerName);
    }
  };

  const getTotalPlants = () => {
    if (!serviceRequest.items) return 0;
    return serviceRequest.items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateCertificateId = () => {
    return `HIMSOLS-${serviceRequest.requestId}-${Date.now().toString().slice(-4)}`;
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      // Create canvas from the certificate div with better settings
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1.5, // Reduced scale for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: 600,
      });

      // Create PDF with optimized settings
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true, // Enable compression
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality for smaller size
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ensure the image fits within the page with margins
      const maxHeight = 210; // A4 landscape height in mm
      const finalHeight = Math.min(imgHeight, maxHeight);
      const yPosition = (maxHeight - finalHeight) / 2; // Center vertically

      pdf.addImage(imgData, 'JPEG', 0, yPosition, imgWidth, finalHeight);
      pdf.save(`Certificate-${serviceRequest.customerName}-${serviceRequest.requestId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'TREE_PLANTATION':
        return 'Tree Plantation Service';
      case 'WASTE_MANAGEMENT':
        return 'Waste Management Service';
      case 'ENVIRONMENTAL_CONSULTING':
        return 'Environmental Consulting';
      case 'ECO_TOURISM':
        return 'Eco Tourism Initiative';
      default:
        return 'Environmental Service';
    }
  };

  const getCongratulationsMessage = () => {
    if (customMessage) {
      return customMessage;
    }

    const totalPlants = getTotalPlants();
    const currentDate = new Date();
    const isNewYear = currentDate.getMonth() === 0 && currentDate.getDate() <= 15; // January 1-15
    const isDiwali = currentDate.getMonth() === 10; // November (approximate Diwali season)
    const isEarthDay = currentDate.getMonth() === 3 && currentDate.getDate() === 22; // April 22
    const isEnvironmentDay = currentDate.getMonth() === 5 && currentDate.getDate() === 5; // June 5

    let message = '';
    
    // Birthday wish logic with enhanced messaging
    if (showBirthdayWish) {
      message = `🎂 जन्मदिन की हार्दिक शुभकामनाएं! 🎂 आपका ${totalPlants > 0 ? `${totalPlants} पौधों का` : ''} पर्यावरण संरक्षण का योगदान आपके जन्मदिन को और भी खुशियों से भर देता है। आप माँ पृथ्वी को दिया गया यह उपहार प्रेरणादायक है।`;
      return message;
    }
    
    // Base message about environmental contribution
    message = 'आपने पर्यावरण संरक्षण में अपना अमूल्य योगदान दिया है।';

    // Add special occasion wishes
    if (isNewYear) {
      message += ' नव वर्ष की हार्दिक शुभकामनाएं! 🎉';
    } else if (isDiwali) {
      message += ' दीपावली की हार्दिक शुभकामनाएं! 🪔';
    } else if (isEarthDay) {
      message += ' पृथ्वी दिवस की शुभकामनाएं! 🌍';
    } else if (isEnvironmentDay) {
      message += ' विश्व पर्यावरण दिवस की शुभकामनाएं! 🌱';
    } else {
      message += ' आपका प्रयास प्रशंसनीय है! 🌟';
    }

    return message;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Environment Contribution Certificate
          </DialogTitle>
          <DialogDescription>
            Generate a beautiful certificate for the customer's environmental contribution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Birthday Wish Checkbox Control */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="birthdayWishToggle"
                checked={showBirthdayWish}
                onChange={handleBirthdayWishChange}
                className="h-5 w-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="birthdayWishToggle" className="text-sm font-medium text-yellow-800 cursor-pointer">
                🎂 Include Birthday Wish in Certificate
              </label>
            </div>
            <p className="text-xs text-yellow-600 mt-2 ml-8">
              {showBirthdayWish ? 
                "Birthday wishes are enabled! The certificate will include special birthday greetings." : 
                "Click to add birthday wishes to make this certificate extra special!"
              }
            </p>
          </div>
          {/* Certificate Preview */}
          <div 
            ref={certificateRef}
            className="relative w-full bg-gradient-to-br from-green-50 via-white to-green-50 border-8 border-green-600 rounded-lg overflow-hidden mx-auto"
            style={{ width: '800px', height: '580px' }} // Reduced height to prevent cropping
          >
            {/* Decorative border pattern */}
            <div className="absolute inset-2 border-4 border-green-300 border-dashed rounded-lg"></div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-repeat opacity-10" 
                   style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                   }}>
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center pt-6 px-8"> {/* Reduced top padding */}
              {/* Header with conditional birthday styling */}
              <div className="mb-3 flex flex-col items-center"> {/* Reduced margin */}
                {/* Himsols Logo */}
                <img 
                  src="/himsols_logo_transparent.png" 
                  alt="Himsols Logo" 
                  className="w-20 h-20 mb-2 object-contain filter drop-shadow-sm"
                />
                
                {/* Birthday Header if enabled */}
                {showBirthdayWish && (
                  <div className="bg-gradient-to-r from-yellow-200 to-pink-200 border-2 border-yellow-400 rounded-lg p-3 mb-3 shadow-lg">
                    <h1 className="text-2xl font-bold text-yellow-800 mb-1 animate-pulse">🎂 जन्मदिन मुबारक! 🎂</h1>
                    <p className="text-sm text-yellow-700 font-semibold">Happy Birthday - Special Environment Certificate</p>
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-green-800 mb-1">🌿 प्रमाण पत्र 🌿</h1> {/* Reduced text size */}
                <h2 className="text-xl font-bold text-green-700">CERTIFICATE OF APPRECIATION</h2> {/* Reduced text size */}
                <p className="text-base text-green-600 font-semibold mt-1">HIMSOLS - हिमाचल की हरित डिजिटल पहल</p> {/* Reduced text size */}
              </div>

              {/* Main content */}
              <div className="space-y-4 px-4"> {/* Reduced spacing */}
                <div className="text-center">
                  <p className="text-base text-gray-700 mb-3">This Certificate is Proudly Presented To</p> {/* Reduced text size */}
                  <h3 className="text-3xl font-bold text-green-800 mb-4 border-b-2 border-green-300 pb-2 inline-block px-8"> {/* Reduced text size */}
                    {serviceRequest.customerName}
                  </h3>
                </div>

                <div className="text-center space-y-2"> {/* Reduced spacing */}
                  <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto"> {/* Reduced text size */}
                    for your valuable contribution towards protecting and nurturing our environment through 
                    <span className="font-semibold text-green-700"> {getServiceTypeText(serviceRequest.type)}</span>.
                  </p>
                  
                  {/* Trees contribution message */}
                  {getTotalPlants() > 0 && (
                    <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto font-medium">
                      आपने माँ पृथ्वी को <span className="text-green-700 font-bold">{getTotalPlants()}+ पेड़</span> का अनमोल उपहार दिया है।
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto"> {/* Reduced text size */}
                    {getCongratulationsMessage()}
                  </p>

                  {/* Special Birthday Section */}
                  {showBirthdayWish && (
                    <div className="bg-gradient-to-r from-yellow-100 to-pink-100 border-2 border-yellow-300 rounded-lg p-4 mx-8 my-4 shadow-md">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">🎉 Birthday Special 🎉</h3>
                        <p className="text-sm text-yellow-700 mb-2">
                          Your birthday gift to Mother Earth makes this day even more special!
                        </p>
                        <p className="text-xs text-yellow-600 italic">
                          "Best birthdays are celebrated by giving back to nature" 🌱
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-green-100 rounded-lg p-3 mx-8 my-3"> {/* Reduced padding */}
                    <p className="text-base font-semibold text-green-800">💚 "One Tree Today, A Greener Tomorrow." 💚</p> {/* Reduced text size */}
                    <p className="text-xs text-green-700 mt-1"> {/* Reduced text size */}
                      आज एक पेड़, कल हरा भविष्य
                    </p>
                  </div>

                  <p className="text-sm text-gray-700"> {/* Reduced text size */}
                    We thank you for being a <span className="font-bold text-green-700">Green Warrior</span> and congratulate you 
                    on becoming an inspiration for others.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end pt-4 px-4"> {/* Reduced padding */}
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Date: {formatDate(serviceRequest.updatedAt)}</p> {/* Reduced text size */}
                    <p className="text-xs text-gray-600">Certificate ID: {generateCertificateId()}</p> {/* Reduced text size */}
                  </div>
                  <div className="text-right">
                    <div className="border-t-2 border-green-600 pt-1 px-3"> {/* Reduced padding */}
                      <p className="text-xs font-semibold text-green-800">🌱 Team Himsols</p> {/* Reduced text size */}
                      <p className="text-xs text-gray-600">www.himsols.com</p> {/* Reduced text size */}
                      <p className="text-xs text-green-600 font-semibold">Green Warrior Certified</p> {/* Reduced text size */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download Certificate PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateGenerator;
