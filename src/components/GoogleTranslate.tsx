'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    // Check if Google Translate is already loaded by the script
    const isAlreadyLoaded = document.getElementById('google-translate-script') || window.google?.translate;
    
    if (isAlreadyLoaded) {
      // If already loaded, just reinitialize the element
      setTimeout(() => {
        if (window.google?.translate?.TranslateElement) {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,ml,ta,te,kn,bn,mr,gu,pa',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              },
              'google_translate_element'
            );
          } catch (error) {
            console.log('Google Translate reinitialization error:', error);
          }
        }
      }, 1000); // Small delay to ensure everything is ready
      return;
    }

    // Define initialization function
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ml,ta,te,kn,bn,mr,gu,pa',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      } catch (error) {
        console.log('Google Translate initialization error:', error);
      }
    };

    // Add script only if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      script.onload = () => {
        console.log('Google Translate script loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      
      document.head.appendChild(script);
    }

    // Minimal cleanup - don't remove the script as it's managed by Google
    return () => {
      try {
        // Only clean up our function, not the script
        delete window.googleTranslateElementInit;
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 z-50">
      <style>
        {`
          .goog-te-banner-frame, .goog-te-menu-frame { display: none !important; }
          .goog-te-gadget { 
            color: transparent !important; 
            font-size: 0 !important; 
            background: transparent !important; 
            border: none !important; 
          }
          .goog-te-combo {
            padding: 8px 12px !important;
            border-radius: 8px !important;
            border: 1px solid rgba(251, 146, 60, 0.3) !important;
            background: rgba(0, 0, 0, 0.2) !important;
            backdrop-filter: blur(10px) !important;
            color: #fbbf24 !important;
            font-size: 14px !important;
            cursor: pointer !important;
            min-width: 140px !important;
            transition: all 0.3s ease !important;
          }
          .goog-te-combo:hover {
            border-color: rgba(251, 146, 60, 0.6) !important;
            background: rgba(0, 0, 0, 0.3) !important;
            color: #fdba74 !important;
          }
          body { top: 0 !important; }
          .goog-logo-link { display: none !important; }
          .goog-te-gadget .goog-te-combo:after {
            content: "🌐" !important;
            margin-left: 8px !important;
            color: #fbbf24 !important;
          }
        `}
      </style>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;