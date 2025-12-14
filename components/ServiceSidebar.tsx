import React from 'react';
import { SERVICES_DATA, CONTACT_INFO } from '../constants';
import { Phone, Globe, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ServiceSidebarProps {
  className?: string;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({ className = "" }) => {
  return (
    <div className={`bg-white border-l border-gray-200 h-full overflow-y-auto ${className}`}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
          서비스 및 가격 안내
        </h2>
        
        <div className="space-y-6">
          {SERVICES_DATA.map((category, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-2">
                      <span className="font-medium text-gray-800 block">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 block mt-0.5">{item.description}</span>
                      )}
                    </div>
                    <span className="font-bold text-indigo-600 whitespace-nowrap">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">문의 채널</h3>
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone size={16} className="text-indigo-600" />
              <span>{CONTACT_INFO.phone} (보이스톡)</span>
            </div>
            <a 
              href={CONTACT_INFO.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              <Globe size={16} />
              <span>웹사이트 방문하기</span>
            </a>
            <div className="flex items-start gap-3 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <MessageSquare size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs leading-relaxed">{CONTACT_INFO.kmongText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSidebar;
